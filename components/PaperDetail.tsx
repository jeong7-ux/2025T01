import React, { useState, useEffect } from 'react';
import { Paper } from '../types';
import { ChevronLeft, Download, ExternalLink, Bookmark, Share2, Quote, Building2, Network } from 'lucide-react';
import { getRelatedPapers } from '../services/geminiService';
import { PaperCard } from './PaperCard';

interface PaperDetailProps {
  paper: Paper;
  onBack: () => void;
  onNavigateToPaper: (paper: Paper) => void;
  onAuthorClick?: (authorName: string) => void;
}

export const PaperDetail: React.FC<PaperDetailProps> = ({ paper, onBack, onNavigateToPaper, onAuthorClick }) => {
  const [relatedPapers, setRelatedPapers] = useState<Paper[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoadingRelated(true);
      try {
        const results = await getRelatedPapers(paper.title);
        setRelatedPapers(results.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingRelated(false);
      }
    };
    fetchRelated();
  }, [paper.title]);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8 pb-20">
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        결과 목록으로 돌아가기
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Paper Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-4">
              {paper.isOpenAccess && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                  Open Access
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 uppercase tracking-wide">
                {paper.journal}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                {paper.year}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              {paper.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-8">
               <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                 <Download className="w-4 h-4 mr-2" />
                 PDF 다운로드
               </button>
               <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                 <Quote className="w-4 h-4 mr-2" />
                 인용하기
               </button>
               <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                 <Bookmark className="w-4 h-4 mr-2" />
                 저장
               </button>
               <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                 <Share2 className="w-4 h-4 mr-2" />
                 공유
               </button>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">초록 (Abstract)</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {paper.fullAbstract || paper.abstract}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">주요 키워드</h3>
              <div className="flex flex-wrap gap-2">
                {paper.keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md text-sm hover:border-indigo-300 hover:text-indigo-600 cursor-pointer transition-colors">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Related Papers Section */}
          <div className="space-y-4">
             <h2 className="text-2xl font-bold text-slate-900">연관 논문</h2>
             {loadingRelated ? (
               <div className="flex items-center justify-center p-12 bg-slate-50 rounded-xl">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
               </div>
             ) : (
               <div className="grid gap-4">
                 {relatedPapers.map(rp => (
                   <PaperCard key={rp.id} paper={rp} onClick={onNavigateToPaper} />
                 ))}
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Meta & Authors */}
        <div className="lg:col-span-1 space-y-6">
          {/* Author Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">저자 정보</h3>
            <div className="space-y-4">
              {paper.authors.map((author, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div 
                            className="font-medium text-slate-900 flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors group"
                            onClick={() => onAuthorClick && onAuthorClick(author.name)}
                        >
                        {author.name}
                        {idx === 0 && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded group-hover:bg-indigo-50 group-hover:text-indigo-600">제1저자</span>}
                        </div>
                        <button 
                            onClick={() => onAuthorClick && onAuthorClick(author.name)}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-indigo-50 transition-colors"
                            title="연구 네트워크 보기"
                        >
                            <Network className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center mt-1">
                      <Building2 className="w-3 h-3 mr-1" />
                      {author.affiliation}
                    </div>
                    {author.hIndex && (
                       <div className="text-xs text-indigo-600 font-medium mt-1">
                         H-Index: {author.hIndex}
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">논문 지표</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">{paper.citations}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">인용 수</div>
                </div>
                 <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-slate-700">6.8</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Impact Factor</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">외부 링크</h4>
              <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer" className="flex items-center text-sm text-indigo-600 hover:underline mb-2">
                <ExternalLink className="w-3 h-3 mr-2" />
                출판사 원문 보기
              </a>
              {paper.pmid && (
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}`} target="_blank" rel="noreferrer" className="flex items-center text-sm text-slate-600 hover:text-indigo-600 hover:underline">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  PubMed에서 보기
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
