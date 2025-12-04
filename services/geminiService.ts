import { GoogleGenAI, Type } from "@google/genai";
import { Paper, SearchFilters, GraphData, GraphNode, GraphLink } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 검색 백엔드를 시뮬레이션하기 위해 Gemini에게 쿼리를 기반으로 현실적인 논문 데이터를 생성하도록 요청합니다.
export const searchPapersWithGemini = async (query: string, filters: SearchFilters): Promise<Paper[]> => {
  const model = "gemini-2.5-flash";

  const systemInstruction = `
    당신은 학술 데이터베이스 시뮬레이터입니다.
    사용자의 검색 쿼리를 기반으로 6-8개의 현실적인 과학 논문 데이터를 생성하십시오.
    
    중요:
    1. 논문 제목과 초록은 **한국어**로 번역하거나 한국어 관련 주제라면 한국어로 작성하십시오.
    2. 저자 이름은 한국인 저자가 포함되도록 하거나 원어를 유지하십시오.
    3. 데이터는 실제 존재하는 것처럼 진정성 있게(제목, 저널, 저자) 만드십시오.
    4. 의학 주제라면 의학 저널(NEJM, Lancet 등), 컴퓨터 과학이라면 IEEE, ACM 등을 사용하십시오.
    5. 제공된 필터 조건을 준수하십시오.
  `;

  const prompt = `
    검색어: "${query}"
    필터: ${JSON.stringify(filters)}
    
    JSON 형식의 논문 목록을 반환해 주세요.
    각 논문은 다음을 포함해야 합니다:
    - id (고유 문자열)
    - title (한국어 권장)
    - authors (name, affiliation, hIndex를 포함한 객체 배열)
    - abstract (짧은 요약, 약 150자, 한국어)
    - fullAbstract (상세 요약, 약 500자, 한국어)
    - journal
    - year (2010~2024 사이)
    - citations (현실적인 숫자)
    - doi (가상의 DOI 형식)
    - pmid (선택적 가상의 PMID)
    - isOpenAccess (boolean)
    - keywords (3-5개의 태그 배열, 한국어)
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              authors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    affiliation: { type: Type.STRING },
                    hIndex: { type: Type.INTEGER },
                    orcid: { type: Type.STRING },
                  }
                }
              },
              abstract: { type: Type.STRING },
              fullAbstract: { type: Type.STRING },
              journal: { type: Type.STRING },
              year: { type: Type.INTEGER },
              citations: { type: Type.INTEGER },
              doi: { type: Type.STRING },
              pmid: { type: Type.STRING },
              isOpenAccess: { type: Type.BOOLEAN },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Paper[];
    }
    return [];
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};

export const getRelatedPapers = async (paperTitle: string): Promise<Paper[]> => {
    // 연관 논문 검색을 위한 가벼운 쿼리
    return searchPapersWithGemini(`다음 논문과 관련된 논문: ${paperTitle}`, {
        isOpenAccessOnly: false,
        isReviewOnly: false,
        sortBy: 'relevance'
    });
}

// 저자 중심의 지식 그래프 데이터 생성 (Mock SPARQL 쿼리 결과)
export const getAuthorNetwork = async (authorName: string): Promise<GraphData> => {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      당신은 온톨로지 지식 그래프 생성기입니다.
      특정 저자를 중심으로 연결된 연구물(논문, 보고서, 발표자료 등)의 네트워크 데이터를 생성합니다.
      
      노드 타입:
      - author: 저자 (중심 노드)
      - paper: 학술 논문 (파란색 계열)
      - report: 연구 보고서 (초록색 계열)
      - presentation: 발표 자료 (주황색 계열)
      
      요구사항:
      1. 중심 저자는 1명입니다.
      2. 연구물은 약 10~15개를 생성하십시오.
      3. 인용 수(citations)는 노드 크기 결정을 위해 다양하게 설정하십시오.
      4. 한국어 제목과 데이터를 사용하십시오.
    `;

    const prompt = `저자 이름: "${authorName}"
    위 저자를 중심으로 한 GraphData JSON을 반환해 주세요.
    반환 형식:
    {
      "centralAuthor": { "name": string, "affiliation": string, "hIndex": number },
      "nodes": [ { "id": string, "label": string, "type": "author"|"paper"|"report"|"presentation", "year": number, "citations": number, "metadata": { "journal": string, "abstract": string } } ],
      "links": [ { "source": string, "target": string, "value": number } ]
    }
    주의: "links"의 source는 반드시 author의 id여야 하며, target은 연구물의 id여야 합니다.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        centralAuthor: {
                             type: Type.OBJECT,
                             properties: {
                                 name: { type: Type.STRING },
                                 affiliation: { type: Type.STRING },
                                 hIndex: { type: Type.INTEGER }
                             }
                        },
                        nodes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    label: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    year: { type: Type.INTEGER },
                                    citations: { type: Type.INTEGER },
                                    metadata: {
                                        type: Type.OBJECT,
                                        properties: {
                                            journal: { type: Type.STRING },
                                            abstract: { type: Type.STRING }
                                        }
                                    }
                                }
                            }
                        },
                        links: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    source: { type: Type.STRING },
                                    target: { type: Type.STRING },
                                    value: { type: Type.INTEGER }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as GraphData;
        }
        throw new Error("No data returned");
    } catch (e) {
        console.error("Graph Generation Error", e);
        // Fallback mock data if API fails
        return {
            centralAuthor: { name: authorName, affiliation: "한국과학기술원", hIndex: 12 },
            nodes: [
                { id: "a1", label: authorName, type: "author", year: 2024, citations: 0 },
                { id: "p1", label: "인공지능의 미래", type: "paper", year: 2023, citations: 45, metadata: { journal: "AI Research", abstract: "AI 요약" } },
                { id: "p2", label: "딥러닝 최적화", type: "report", year: 2022, citations: 20, metadata: { journal: "KIST Report", abstract: "보고서 요약" } }
            ],
            links: [
                { source: "a1", target: "p1", value: 1 },
                { source: "a1", target: "p2", value: 1 }
            ]
        };
    }
};
