import React from 'react';
import { SajuResult, UserInput, FortuneDetail } from '../types';
import SajuChart from './SajuChart';
import FiveElementsChart from './FiveElementsChart';

interface ResultViewProps {
  result: SajuResult;
  userData: UserInput;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, userData, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-1.5 rounded-full bg-stone-200/50 text-stone-600 text-sm font-medium mb-4">
           {userData.birthDate} {userData.birthTime || ''} {userData.gender}
        </div>
        <h2 className="text-4xl font-bold text-stone-800 serif mb-2 tracking-tight">
          {userData.name ? `${userData.name}님의` : '당신의'} 운명 분석서
        </h2>
        <div className="w-16 h-1 bg-stone-300 mx-auto mt-6 rounded-full"></div>
      </div>

      <SajuChart pillars={result.pillars} />
      <FiveElementsChart elements={result.elements} />

      {/* Fortunes */}
      <div className="bg-[#f1f8e9] rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-stone-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-stone-800 mb-8 serif flex items-center">
          <span className="bg-stone-800 w-1.5 h-6 mr-3 rounded-full opacity-80"></span>
          시기별 운세 흐름
        </h3>
        <div className="space-y-6">
            <div className="p-6 bg-[#f7fcfc] rounded-2xl border border-[#e0f2f1] shadow-sm">
                <div className="flex items-center mb-3">
                    <span className="px-2.5 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full mr-2">Today</span>
                    <h4 className="font-bold text-stone-800">오늘의 운세</h4>
                </div>
                <p className="text-stone-600 leading-relaxed font-light">{result.dailyFortune}</p>
            </div>
            <div className="p-6 bg-[#fcfbf7] rounded-2xl border border-[#f0ebd8] shadow-sm">
                <div className="flex items-center mb-3">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mr-2">Month</span>
                    <h4 className="font-bold text-stone-800">이번 달의 흐름</h4>
                </div>
                <p className="text-stone-600 leading-relaxed font-light">{result.monthlyFortune}</p>
            </div>
            <div className="p-6 bg-[#fcf7f7] rounded-2xl border border-[#f2e0e0] shadow-sm">
                <div className="flex items-center mb-3">
                    <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full mr-2">Year</span>
                    <h4 className="font-bold text-stone-800">올해의 총운</h4>
                </div>
                <p className="text-stone-600 leading-relaxed font-light">{result.yearlyFortune}</p>
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         {(Object.entries(result.categories) as [string, FortuneDetail][]).map(([key, item]) => (
             <div key={key} className="bg-[#f1f8e9] rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-stone-100 p-8 hover:translate-y-[-2px] transition-transform duration-300">
                 <div className="flex items-center justify-between mb-5">
                    <h4 className="font-bold text-stone-800 text-xl serif">{item.title}</h4>
                    <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-stone-200/50 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#9ccc65] rounded-full" 
                                style={{ width: `${item.score}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{item.score}%</span>
                    </div>
                 </div>
                 <p className="text-stone-600 text-sm leading-7 font-light">{item.content}</p>
             </div>
         ))}
      </div>

      {/* Advice */}
      <div className="bg-stone-800 rounded-3xl shadow-xl p-10 mb-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-8 serif flex items-center">
            <span className="text-red-500 mr-3 text-2xl">✨</span>
            행운을 부르는 조언
            </h3>
            <ul className="space-y-6">
                {result.advice.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-amber-100 text-sm font-bold mr-4">{idx + 1}</span>
                        <span className="text-stone-200 leading-relaxed pt-1 font-light">{tip}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* Footer / Disclaimer */}
      <div className="text-center space-y-8">
        <p className="text-xs text-stone-400 font-medium bg-[#f1f8e9] inline-block px-4 py-2 rounded-full">
            {result.disclaimer}
        </p>
        <div>
            <button 
                onClick={onReset}
                className="px-8 py-3 bg-white border border-stone-200 rounded-2xl text-stone-600 hover:bg-[#f1f8e9] hover:text-stone-800 hover:border-[#dcedc8] transition-all text-sm font-medium shadow-sm"
            >
                다시 분석하기
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultView;