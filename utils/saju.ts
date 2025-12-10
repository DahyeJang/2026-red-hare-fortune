import { Solar } from 'lunar-javascript';

// 천간(天干) 배열
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 지지(地支) 배열
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 띠 동물 배열
const ZODIAC_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

// 오행 매핑
const FIVE_ELEMENTS: Record<string, '목' | '화' | '토' | '금' | '수'> = {
  // 천간 오행
  '甲': '목',
  '乙': '목',
  '丙': '화',
  '丁': '화',
  '戊': '토',
  '己': '토',
  '庚': '금',
  '辛': '금',
  '壬': '수',
  '癸': '수',
  // 지지 오행
  '寅': '목',
  '卯': '목',
  '巳': '화',
  '午': '화',
  '辰': '토',
  '戌': '토',
  '丑': '토',
  '未': '토',
  '申': '금',
  '酉': '금',
  '子': '수',
  '亥': '수',
};

export interface SajuResult {
  // 천간 (년, 월, 일, 시)
  heavenlyStems: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  // 지지 (년, 월, 일, 시)
  earthlyBranches: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  // 오행 개수
  fiveElements: {
    목: number;
    화: number;
    토: number;
    금: number;
    수: number;
  };
  // 만 나이
  age: number;
  // 띠
  zodiac: string;
}

/**
 * 양력 생년월일시를 입력받아 사주를 계산하는 함수
 * @param year 양력 연도
 * @param month 양력 월 (1-12)
 * @param day 양력 일
 * @param hour 시간 (0-23)
 * @returns 사주 계산 결과
 */
export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hour: number
): SajuResult {
  // 양력 날짜 생성
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // 천간 추출
  const yearGan = eightChar.getYearGan();
  const monthGan = eightChar.getMonthGan();
  const dayGan = eightChar.getDayGan();
  const timeGan = eightChar.getTimeGan();

  // 지지 추출
  const yearZhi = eightChar.getYearZhi();
  const monthZhi = eightChar.getMonthZhi();
  const dayZhi = eightChar.getDayZhi();
  const timeZhi = eightChar.getTimeZhi();

  // 오행 개수 계산
  const elements: Array<'목' | '화' | '토' | '금' | '수'> = [
    FIVE_ELEMENTS[yearGan],
    FIVE_ELEMENTS[monthGan],
    FIVE_ELEMENTS[dayGan],
    FIVE_ELEMENTS[timeGan],
    FIVE_ELEMENTS[yearZhi],
    FIVE_ELEMENTS[monthZhi],
    FIVE_ELEMENTS[dayZhi],
    FIVE_ELEMENTS[timeZhi],
  ];

  const fiveElementsCount = {
    목: elements.filter((e) => e === '목').length,
    화: elements.filter((e) => e === '화').length,
    토: elements.filter((e) => e === '토').length,
    금: elements.filter((e) => e === '금').length,
    수: elements.filter((e) => e === '수').length,
  };

  // 만 나이 계산
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - year;
  if (
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day)
  ) {
    age--;
  }

  // 띠 계산 (지지의 인덱스 사용)
  const zhiIndex = EARTHLY_BRANCHES.indexOf(yearZhi);
  const zodiac = ZODIAC_ANIMALS[zhiIndex] || '';

  return {
    heavenlyStems: {
      year: yearGan,
      month: monthGan,
      day: dayGan,
      hour: timeGan,
    },
    earthlyBranches: {
      year: yearZhi,
      month: monthZhi,
      day: dayZhi,
      hour: timeZhi,
    },
    fiveElements: fiveElementsCount,
    age,
    zodiac,
  };
}

