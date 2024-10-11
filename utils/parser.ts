export function filterGSVLines(dataArray: string[]): string[] {
  // 将数据中的换行符标准化为 \n
  return dataArray
    .map((data: string) => data.replace(/\r\n/g, "\n").replace(/\r/g, "\n")) // Normalize line breaks for each string
    .flatMap((normalizedData: string) => normalizedData.split("\n")) // Split each normalized string into lines
    .filter((line: string) => /^\$..GSV/.test(line)); // Filter lines that match the GSV pattern
}

//getGGA
export function getGGA(dataArray: string[]): string {
  return dataArray.filter((line: string) => /^\$GNGGA/.test(line))[0];
}

export function parseGGA(ggaData: string) {
  const ggaContent = ggaData.split(",").slice(1, -1);

  const timestamp = converToTime(ggaContent[0]);
  const latitude = convertDMSToDecimal(ggaContent[1], ggaContent[2]);
  const longitude = convertDMSToDecimal(ggaContent[3], ggaContent[4]);
  const methods = ggaContent[5];
  const num = ggaContent[6];
  const hdop = ggaContent[7];
  const altitude = ggaContent[8];
  const elevationUnit = ggaContent[9];
  const elevation = `${altitude}${elevationUnit}`;
  const heightAnomaly = `${ggaContent[10]}${ggaContent[11]}`;
  const m = ggaContent.slice(12).join(",");

  return {
    timestamp,
    latitude,
    longitude,
    methods,
    num,
    hdop,
    elevation,
    heightAnomaly,
    m,
  };
}

function converToTime(timestamp: string): string {
  return `${timestamp.slice(0, 2)}:${timestamp.slice(2, 4)}:${timestamp.slice(
    4,
    6
  )}:${timestamp.slice(7, 9)}`;
}

function convertDMSToDecimal(
  degreesMinutes: string,
  direction: string
): number {
  const degrees = parseFloat(degreesMinutes.slice(0, 2));
  const minutes = parseFloat(degreesMinutes.slice(2));
  const decimal = degrees + minutes / 60;
  return direction === "S" || direction === "W" ? -decimal : decimal;
}

interface GSVData {
  type: string;
  subTab: string;
  PRN: string[];
  pitch_angle: string[];
  azimuth_angle: string[];
  cn: string[];
}

export function subTabAdapter(type: string, id: string): string {
  switch (type) {
    case "GP":
      switch (id) {
        case "1":
          return "C/A";
        case "2":
        case "3":
          return "L1";
        case "4":
          return "L2P";
        case "5":
        case "6":
          return "L2C";
        case "7":
        case "8":
          return "L5";
        default:
          return "bad";
      }
    case "GB":
      switch (id) {
        case "1":
          return "B1I";
        case "2":
          return "B1Q";
        case "3":
          return "B1C";
        case "4":
          return "B1A";
        case "5":
          return "B2a";
        case "6":
          return "B2b";
        case "7":
          return "B2a+b";
        case "8":
          return "B3I";
        case "9":
          return "B3Q";
        case "A":
          return "B3A";
        case "B":
          return "B2I";
        case "C":
          return "B2Q";
        default:
          return "bad";
      }
    case "GA":
      switch (id) {
        case "1":
          return "E5a";
        case "2":
          return "E5b";
        case "3":
          return "E5a+b";
        case "4":
          return "E6a";
        case "5":
          return "E6bc";
        case "6":
        case "7":
          return "E1";
        default:
          return "bad";
      }
    case "GL":
      switch (id) {
        case "1":
        case "2":
          return "G1";
        case "3":
        case "4":
          return "G2";
        default:
          return "bad";
      }
    case "GN":
      switch (id) {
        case "1":
          return "L1 C/A";
        case "2":
        case "3":
        case "4":
          return "L1";
        case "5":
        case "6":
          return "L2C";
        case "7":
        case "8":
          return "L5";
        default:
          return "bad";
      }
    default:
      return "bad";
  }
}

export function processGSVLine(line: string): GSVData {
  const parts: string[] = line.split(",");
  const type: string = line.slice(1, 3); // 取出'$__GSV'的__这两个字符
  const parameters: string[] = parts.slice(4, -1); // 去掉前四个
  const lastPart = parts[parts.length - 1];
  const id = lastPart.split("*")[0]; // 获取最后一部分的id
  const subTab = subTabAdapter(type, id); // 使用新的subTabAdapter函数

  const PRN: string[] = [];
  const pitch_angle: string[] = [];
  const azimuth_angle: string[] = [];
  const cn: string[] = [];

  for (let i = 0; i < parameters.length; i += 4) {
    PRN.push(parameters[i]);
    pitch_angle.push(parameters[i + 1]);
    azimuth_angle.push(parameters[i + 2]);
    cn.push(parameters[i + 3]);
  }

  return { type, subTab, PRN, pitch_angle, azimuth_angle, cn };
}

interface StorageType {
  [key: string]: {
    [subKey: string]: {
      PRN: string[];
      pitch_angle: string[];
      azimuth_angle: string[];
      cn: string[];
    };
  };
}

export function storeProcessedDataByType(
  processedDataArray: GSVData[]
): StorageType {
  const storage: StorageType = {};

  processedDataArray.forEach((data: GSVData) => {
    const { type, subTab, ...rest } = data;
    if (!storage[type]) {
      storage[type] = {};
    }
    if (!storage[type][subTab!]) {
      storage[type][subTab!] = {
        PRN: [],
        pitch_angle: [],
        azimuth_angle: [],
        cn: [],
      };
    }

    rest.PRN.forEach((prn: string, index: number) => {
      const existingIndex = storage[type][subTab].PRN.indexOf(prn);
      if (existingIndex === -1) {
        // 如果PRN不存在，添加新的数据
        storage[type][subTab].PRN.push(prn);
        storage[type][subTab].pitch_angle.push(rest.pitch_angle[index]);
        storage[type][subTab].azimuth_angle.push(rest.azimuth_angle[index]);
        storage[type][subTab].cn.push(rest.cn[index]);
      } else {
        // 如果PRN已存在，更新相应的数据
        storage[type][subTab].pitch_angle[existingIndex] =
          rest.pitch_angle[index];
        storage[type][subTab].azimuth_angle[existingIndex] =
          rest.azimuth_angle[index];
        storage[type][subTab].cn[existingIndex] = rest.cn[index];
      }
    });
  });

  return storage;
}

// // 示例使用
// const rawData: string[] = [
//   "$GNRMC,000324.00,A,5005.91904330,N,01433.05570568,E,25.628,230.8,280824,4.4,E,A,C*7B",
//   "$GPGSV,2,1,08,11,30,051,46,12,29,105,46,18,16,182,46,20,16,079,46,1*6A",
//   "$GLGSV,1,1,02,82,56,188,56,79,52,125,57,1*7C",
//   "$GBGSV,2,1,05,03,24,201,53,05,28,206,53,25,55,199,53,20,30,081,53,1*73",
//   "$GBGSV,2,2,05,19,77,306,53,1*48",
//   "$GBGSV,1,1,02,25,55,199,43,20,30,081,43,3*78",
// ];

// const gsvLines = filterGSVLines(rawData);
// const processedData = gsvLines.map(processGSVLine);
// const storedData = storeProcessedDataByType(processedData);

// console.log(storedData);

// // 示例用法
// const ggaData = '$GNGGA,000107.00,5006.54166387,N,01433.40167068,E,1,10,1.3,215.4867,M,44.6158,M,,*76';
// const parsedData = parseGGA(ggaData);
// console.log(parsedData);
