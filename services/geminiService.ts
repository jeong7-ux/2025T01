import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, SajuResponse } from "../types";

const sajuSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    saju: {
      type: Type.OBJECT,
      properties: {
        year: {
          type: Type.OBJECT,
          properties: {
            gan: { type: Type.STRING },
            ji: { type: Type.STRING },
            ganElement: { type: Type.STRING },
            jiElement: { type: Type.STRING },
          },
          required: ["gan", "ji", "ganElement", "jiElement"]
        },
        month: {
          type: Type.OBJECT,
          properties: {
            gan: { type: Type.STRING },
            ji: { type: Type.STRING },
            ganElement: { type: Type.STRING },
            jiElement: { type: Type.STRING },
          },
          required: ["gan", "ji", "ganElement", "jiElement"]
        },
        day: {
          type: Type.OBJECT,
          properties: {
            gan: { type: Type.STRING },
            ji: { type: Type.STRING },
            ganElement: { type: Type.STRING },
            jiElement: { type: Type.STRING },
          },
          required: ["gan", "ji", "ganElement", "jiElement"]
        },
        hour: {
          type: Type.OBJECT,
          properties: {
            gan: { type: Type.STRING },
            ji: { type: Type.STRING },
            ganElement: { type: Type.STRING },
            jiElement: { type: Type.STRING },
          },
          required: ["gan", "ji", "ganElement", "jiElement"]
        },
      },
      required: ["year", "month", "day", "hour"]
    },
    elements: {
      type: Type.OBJECT,
      properties: {
        wood: { type: Type.INTEGER, description: "Percentage value 0-100" },
        fire: { type: Type.INTEGER, description: "Percentage value 0-100" },
        earth: { type: Type.INTEGER, description: "Percentage value 0-100" },
        metal: { type: Type.INTEGER, description: "Percentage value 0-100" },
        water: { type: Type.INTEGER, description: "Percentage value 0-100" },
        strongest: { type: Type.STRING },
        weakest: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ["wood", "fire", "earth", "metal", "water", "strongest", "weakest", "description"]
    },
    fortunes: {
      type: Type.OBJECT,
      properties: {
        wealth: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            score: { type: Type.INTEGER },
          },
          required: ["title", "content", "score"]
        },
        health: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            score: { type: Type.INTEGER },
          },
          required: ["title", "content", "score"]
        },
        love: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            score: { type: Type.INTEGER },
          },
          required: ["title", "content", "score"]
        },
        career: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            score: { type: Type.INTEGER },
          },
          required: ["title", "content", "score"]
        },
      },
      required: ["wealth", "health", "love", "career"]
    },
    timeline: {
      type: Type.OBJECT,
      properties: {
        today: { type: Type.STRING },
        thisMonth: { type: Type.STRING },
        thisYear: { type: Type.STRING },
      },
      required: ["today", "thisMonth", "thisYear"]
    },
    advice: { type: Type.STRING },
  },
  required: ["saju", "elements", "fortunes", "timeline", "advice"]
};

export const generateSajuReport = async (input: UserInput): Promise<SajuResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    당신은 세계적으로 유명한 역술가이자 동아시아 명리학 전문가입니다.
    아래 사용자 정보를 바탕으로 사주(Four Pillars)를 계산하고, 토종비결과 명리학적 관점에서 해석을 제공해 주세요.

    [사용자 정보]
    이름: ${input.name || '무명'}
    생년월일: ${input.birthDate}
    태어난 시간: ${input.birthTime}
    성별: ${input.gender}

    [지시사항]
    1. **사주 구성**: 입력된 양력 날짜를 음력 및 60갑자(간지)로 변환하여 연주, 월주, 일주, 시주를 정확히 계산하십시오. (시간이 '모름'이나 'unknown'인 경우 시주는 '미상' 또는 일반적인 추론으로 처리하되, 구체적인 간지는 표시하지 않거나 추정치로 넣고 설명에 명시하세요).
    2. **오행 분석**: 목, 화, 토, 금, 수의 비율(0~100)을 추산하고 강약을 분석하십시오.
    3. **운세 해석**:
       - 재물, 건강, 연애, 직업에 대해 긍정적이고 희망적인 어조로 '경향성'을 설명하세요.
       - 점수(Score)는 0~100 사이로 매기세요.
    4. **종합 리포트**:
       - 오늘, 이번 달, 올해의 흐름을 요약하세요.
       - 사용자에게 도움이 될 현실적인 '생활 조언'을 한 문단 작성하세요.
    5. **제약 사항**:
       - 죽음, 질병, 사고 등 부정적이고 단정적인 예언은 절대 금지합니다.
       - 엔터테인먼트 목적임을 감안하여 부드럽고 신비로운, 하지만 이해하기 쉬운 문체를 사용하세요.

    결과는 반드시 지정된 JSON 스키마를 따르십시오.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: sajuSchema,
        temperature: 0.7, // Slightly creative but grounded
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");
    
    return JSON.parse(text) as SajuResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
