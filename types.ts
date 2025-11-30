export enum Gender {
  MALE = '남성',
  FEMALE = '여성'
}

export interface UserInput {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: Gender;
}

export interface Pillar {
  gan: string; // 천간
  ji: string;  // 지지
  ganKr: string;
  jiKr: string;
}

export interface SajuPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  time: Pillar;
}

export interface FiveElements {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  analysis: string; // 강약 분석 텍스트
}

export interface FortuneDetail {
  title: string;
  content: string;
  score: number; // 0-100 for visualization
}

export interface SajuResult {
  pillars: SajuPillars;
  elements: FiveElements;
  dailyFortune: string;
  monthlyFortune: string;
  yearlyFortune: string;
  categories: {
    wealth: FortuneDetail;
    health: FortuneDetail;
    love: FortuneDetail;
    career: FortuneDetail;
  };
  advice: string[];
  disclaimer: string;
}