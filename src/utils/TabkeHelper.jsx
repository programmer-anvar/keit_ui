import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // import UTC plugin for dayjs
import timezone from "dayjs/plugin/timezone"; // import timezone plugin for dayjs

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Date format
const format = "YYYY-MM-DD HH:mm:ss";

// Mappings
const stateMapping = {
  APPROVED: "사용",
  PENDING: "대기",
  DELETED: "삭제",
};

const pollutantTypeMapping = {
  GASEOUS: "가스상",
  PARTICULAR: "입자상",
};

const fieldTypeMapping = {
  ATMOSPHERE: "대기",
  WATER_QUALITY: "수질",
  STINK: "악취",
  NOISE: "소음/진동",
};

const meaMethodMapping = {
  A: "1조 (A)",
  B: "2조 (B)",
  C: "3조 (C)",
  D: "4조 (D)",
  E: "5조 (E)",
  G: "6조 (G)",
  H: "7조 (H)",
  K: "8조 (K)",
  M: "9조 (M)",
  P: "10조 (P)",
  Q: "11조 (Q)",
  R: "12조 (R)",
  S: "13조 (S)",
  T: "14조 (T)",
  U: "15조 (U)",
};
const approvalStateMapping = {
  PRE_PAYMENT: "결제전",
  TL_REQUEST: "팀장요청",
  DH_REQUEST: "부서장요청",
  COMPLETE_PAYMENT: "결제완료",
};

const businessTypeMapping = {
  T1: "1종",
  T1_SPECIAL: "1종(특)",
  T2: "2종",
  T2_SPECIAL: "2종(특)",
  T3: "3종",
  T4: "4종",
  T5: "5종",
  T5_SPECIAL: "5종(특)",
};
const responsibilityMapping = {
  M_ATMOSPHERIC: "대기 측정",
  M_WATER_QUALITY: "수질 측정",
  M_ODOR: "악취 측정",
  M_NOISE_VIB: "소음/진동 측정",
  M_IOT: "IOT 관리",
  M_ACCOUNTING: "회계 담당자",
  MA_AIR_ENV: "대기 환경관리대행",
  MA_WATER_QUALITY_ENV: "수질 환경관리대행",
  OTHER: "기타",
};

const positionMapping = {
  STUFF: "STUFF",
  MANAGER: "MANAGER",
  TEAM_MANAGER: "TEAM_MANAGER",
  ENGINEER: "환경기술인",
  CEO: "대표자",
};

const unitMapping = {
  TON_HR: "ton/hr",
  M3: "m³",
  HP: "HP",
  KW: "kW",
  L_HR: "L/hr",
  KG_HR: "kg/hr",
  M3_MIN: "m³/min",
  KCAL_HR: "kcal/hr",
  TON_HR_ETC: "ton/hr 외",
  M3_ETC: "m³ 외",
  HP_ETC: "HP 외",
  KW_ETC: "kW 외",
  KG_HR_ETC: "kg/hr 외",
  M3_MIN_ETC: "m³/min 외",
  KCAL_HR_ETC: "kcal/hr 외",
  MCAL_HR_ETC: "Mcal/hr 외",
  TON: "톤",
};

const heightMapping = {
  M10_LESS: "10 m 이하",
  M20_LESS: "20 m 이하",
  M30_LESS: "30 m 이하",
  M40_LESS: "40 m 이하",
  M50_LESS: "50 m 이하",
};

const cycleMapping = {
  ONCE_A_WEEK: "1회/주",
  ONCE_2_WEEKS: "1회/2주",
  ONCE_A_MONTH: "1회/월",
  TWICE_A_MONTH: "2회/월",
  ONCE_2_MONTHS: "1회/2개월",
  ONCE_A_QUARTER: "1회/분기",
  ONCE_A_SEMIANNUAL: "1회/반기",
  ONCE_A_YEAR: "1회/년",
  REFERENCE_ONLY: "참고용",
};

const tmsMapping = {
  ATTACHED: "부착",
  NOT_ATTACHED: "미부착",
};

const researcherTypeMapping = {
  PRINCIPAL: "수석연구원",
  LEAD: "책임연구원",
  SENIOR: "선임연구원",
  FELLOW: "주임연구원",
  RESEARCHER: "연구원",
};

const inspectionPurposeMapping = {
  MEASUREMENT: "자가측정(시설관리)",
  REFERENCE: "참고용",
  SUBMISSION: "제출용",
};
const processClassificationMapping = {
  COMMON: "일반",
  EMERGENCY: "긴급",
};

const windDirectionMapping = {
  S: "남",
  SSW: "남남서",
  SW: "남서",
  SSE: "남남동",
  SE: "남동",
  E: "동",
  ESE: "동남동",
  ENE: "동북동",
  N: "북",
  NNE: "북북동",
  NE: "북동",
  NNW: "북북서",
  NW: "북서",
  W: "서",
  WNW: "서북서",
  WSW: "서남서",
  CALM: "정은",
};

const weatherMapping = {
  SUNNY: "맑음",
  FOGGY: "흐림",
  CLOUDY: "구름",
  RAINY: "비",
  SNOWY: "눈",
};

const smokeMapping = {
  S0: "0",
  S1: "1",
  S2: "2",
  S3: "3",
  S4: "4",
  S5: "5",
};

const TableHelper = {
  stateText(state) {
    return stateMapping[state] || state;
  },

  formatDate(dateString) {
    if (!dateString) {
      return null;
    }

    const utcDate = dayjs.utc(dateString);
    const koreaDate = utcDate.tz("Asia/Seoul");
    return koreaDate.format(format);
  },

  pollutantTypeText(type) {
    return pollutantTypeMapping[type] || type;
  },

  fieldTypeText(type) {
    return fieldTypeMapping[type] || type;
  },
  meaMethodText(value) {
    return meaMethodMapping[value] || value;
  },

  approvalStateText(value) {
    return approvalStateMapping[value] || value;
  },

  businessTypeText(value) {
    return businessTypeMapping[value] || value;
  },

  responsibilityText(value) {
    return responsibilityMapping[value] || value;
  },

  positionText(value) {
    return positionMapping[value] || value;
  },
  unitText(value) {
    return unitMapping[value] || value;
  },
  heightText(value) {
    return heightMapping[value] || value;
  },

  cycleText(value) {
    return cycleMapping[value] || value;
  },

  tmsText(value) {
    return tmsMapping[value] || value;
  },

  researcherTypeText(value) {
    return researcherTypeMapping[value] || value;
  },
  inspectionPurposeText(value) {
    return inspectionPurposeMapping[value] || value;
  },
  processClassificationText(value) {
    return processClassificationMapping[value] || value;
  },

  windDirectionText(value) {
    return windDirectionMapping[value] || value;
  },

  weatherText(value) {
    return weatherMapping[value] || value;
  },
  smokeText(value) {
    return smokeMapping[value] || value;
  },
};

export default TableHelper;
