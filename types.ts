export enum Gender {
  MALE = '남성',
  FEMALE = '여성'
}

export interface UserInput {
  name: string;
  birthDate: string;
  birthTime: string; // 'unknown' or 'HH:mm'
  gender: Gender;
}

export interface Pillar {
  gan: string; // Heavenly Stem (천간)
  ji: string;  // Earthly Branch (지지)
  ganElement: string;
  jiElement: string;
}

export interface SajuChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface ElementAnalysis {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  strongest: string;
  weakest: string;
  description: string;
}

export interface FortuneCategory {
  title: string;
  content: string;
  score: number; // 1-100
}

export interface TimelineFortune {
  today: string;
  thisMonth: string;
  thisYear: string;
}

export interface SajuResponse {
  saju: SajuChart;
  elements: ElementAnalysis;
  fortunes: {
    wealth: FortuneCategory;
    health: FortuneCategory;
    love: FortuneCategory;
    career: FortuneCategory;
  };
  timeline: TimelineFortune;
  advice: string;
}