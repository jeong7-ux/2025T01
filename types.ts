export interface Author {
  name: string;
  affiliation: string;
  hIndex?: number;
  orcid?: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: Author[];
  abstract: string;
  fullAbstract?: string; // 상세 보기를 위한 확장 초록
  journal: string;
  year: number;
  citations: number;
  doi: string;
  pmid?: string;
  isOpenAccess: boolean;
  keywords: string[];
  pdfUrl?: string;
}

export interface SearchFilters {
  yearFrom?: number;
  yearTo?: number;
  isOpenAccessOnly: boolean;
  isReviewOnly: boolean;
  sortBy: 'relevance' | 'newest' | 'citations';
}

export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  authMethods: ('email' | 'kakao' | 'naver' | 'google' | 'apple')[];
  joinDate: string;
}

export type ViewState = 'HOME' | 'RESULTS' | 'DETAIL' | 'AUTH' | 'PROFILE' | 'GRAPH';
export type AuthView = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

// --- Graph Visualization Types ---

export type NodeType = 'author' | 'paper' | 'report' | 'presentation' | 'thesis';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  year?: number;
  citations?: number;
  metadata?: any; // 추가 정보 (초록, 저널 등)
  r?: number; // 시각화용 반지름
  color?: string; // 시각화용 색상
  
  // D3 Simulation properties
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value?: number; // 관계의 강도
  
  // D3 Simulation properties
  index?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  centralAuthor: Author;
}