import React from 'react';
import { Paper } from '../types';
import { BookOpen, Calendar, Users, MessageSquareQuote } from 'lucide-react';

interface PaperCardProps {
  paper: Paper;
  onClick: (paper: Paper) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper, onClick }) => {
  return (
    <div 
      onClick={() => onClick(paper)}
      className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer flex flex-col gap-3"
    >
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-xl font-semibold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
          {paper.title}
        </h3>
        {paper.isOpenAccess && (
          <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <BookOpen className="w-3 h-3 mr-1" />
            Open Access
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{paper.year}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-slate-700">{paper.journal}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquareQuote className="w-4 h-4" />
          <span>인용 {paper.citations}회</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Users className="w-4 h-4 text-slate-400" />
        <span className="truncate max-w-md">
          {paper.authors.map(a => a.name).join(', ')}
        </span>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
        {paper.abstract}
      </p>

      <div className="flex flex-wrap gap-2 mt-2">
        {paper.keywords.slice(0, 4).map((keyword, idx) => (
          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
            #{keyword}
          </span>
        ))}
      </div>
      
      <div className="flex items-center gap-4 mt-2 pt-4 border-t border-slate-100 text-xs text-slate-400 font-mono">
        <span>DOI: {paper.doi}</span>
        {paper.pmid && <span>PMID: {paper.pmid}</span>}
      </div>
    </div>
  );
};
