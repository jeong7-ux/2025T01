import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, SajuResult } from "../types";

const parseJsonSafe = (text: string) => {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    throw new Error("운세 데이터를 분석하는 중 오류가 발생했습니다.");
  }
};

export const analyzeSaju = async (input: UserInput): Promise<SajuResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    역할: 당신은 세계적으로 유명한 동아시아 명리학(Saju) 및 토정비결 전문가입니다.
    
    작업: 아래 사용자 정보를 바탕으로 사주팔자(네 기둥)를 계산하고, 오행의 흐름을 분석하며, 토정비결에 기반한 운세를 해석해 주세요.
    
    [사용자 정보]
    - 이름: ${input.name || '무명'}
    - 양력 생년월일: ${input.birthDate}
    - 태어난 시간: ${input.birthTime}
    - 성별: ${input.gender}

    [요구사항]
    1. 사주(Year, Month, Day, Time)의 천간(Gan)과 지지(Ji)를 정확히 계산하세요. (한자와 한글 병기)
    2. 오행(목, 화, 토, 금, 수)의 분포를 0~100 사이의 수치로 추산하고, 과다/부족/균형 상태를 분석하세요.
    3. 운세는 '오늘', '이번 달', '올해'로 나누어 서술하세요.
    4. 재물, 건강, 연애, 직업에 대해 구체적이지만 "경향성" 위주로 서술하세요. (단정적 예언 금지)
    5. 조언은 긍정적이고 실천 가능한 생활 팁으로 제공하세요.
    6. 반드시 엔터테인먼트용임을 명시하는 문구를 포함하세요.
    7. JSON 형식으로만 출력하세요.

    [JSON 출력 스키마]
    {
      "pillars": {
        "year": { "gan": "한자", "ji": "한자", "ganKr": "한글", "jiKr": "한글" },
        "month": { ... },
        "day": { ... },
        "time": { ... }
      },
      "elements": {
        "wood": number, "fire": number, "earth": number, "metal": number, "water": number,
        "analysis": "오행 균형 상세 분석 텍스트"
      },
      "dailyFortune": "오늘의 운세 텍스트",
      "monthlyFortune": "이번 달 흐름 텍스트",
      "yearlyFortune": "올해 총운 텍스트",
      "categories": {
        "wealth": { "title": "재물운", "content": "내용", "score": number },
        "health": { "title": "건강운", "content": "내용", "score": number },
        "love": { "title": "연애/대인운", "content": "내용", "score": number },
        "career": { "title": "직업/학업운", "content": "내용", "score": number }
      },
      "advice": ["조언1", "조언2", "조언3"],
      "disclaimer": "※ 본 해석은 전통 명리 기반의 오락용 콘텐츠입니다."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Setting a clear schema helps reliability, though simple JSON mode is often enough for this structure
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pillars: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.OBJECT, properties: { gan: {type: Type.STRING}, ji: {type: Type.STRING}, ganKr: {type: Type.STRING}, jiKr: {type: Type.STRING} } },
                month: { type: Type.OBJECT, properties: { gan: {type: Type.STRING}, ji: {type: Type.STRING}, ganKr: {type: Type.STRING}, jiKr: {type: Type.STRING} } },
                day: { type: Type.OBJECT, properties: { gan: {type: Type.STRING}, ji: {type: Type.STRING}, ganKr: {type: Type.STRING}, jiKr: {type: Type.STRING} } },
                time: { type: Type.OBJECT, properties: { gan: {type: Type.STRING}, ji: {type: Type.STRING}, ganKr: {type: Type.STRING}, jiKr: {type: Type.STRING} } },
              }
            },
            elements: {
              type: Type.OBJECT,
              properties: {
                wood: { type: Type.NUMBER },
                fire: { type: Type.NUMBER },
                earth: { type: Type.NUMBER },
                metal: { type: Type.NUMBER },
                water: { type: Type.NUMBER },
                analysis: { type: Type.STRING }
              }
            },
            dailyFortune: { type: Type.STRING },
            monthlyFortune: { type: Type.STRING },
            yearlyFortune: { type: Type.STRING },
            categories: {
              type: Type.OBJECT,
              properties: {
                wealth: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, score: {type: Type.NUMBER} } },
                health: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, score: {type: Type.NUMBER} } },
                love: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, score: {type: Type.NUMBER} } },
                career: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, score: {type: Type.NUMBER} } },
              }
            },
            advice: { type: Type.ARRAY, items: { type: Type.STRING } },
            disclaimer: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return parseJsonSafe(text) as SajuResult;
  } catch (error) {
    console.error("API Call Failed", error);
    throw error;
  }
};
