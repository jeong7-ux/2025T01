import React from 'react';
import { SajuPillars, Pillar } from '../types';

interface SajuChartProps {
  pillars: SajuPillars;
}

const PillarBox: React.FC<{ title: string; pillar: Pillar }> = ({ title, pillar }) => (
  <div className="flex flex-col items-center bg-white/80 border border-stone-100 rounded-2xl p-5 w-full shadow-sm hover:shadow-md transition-shadow">
    <span className="text-xs text-stone-500 font-medium mb-3 uppercase tracking-wider bg-[#f1f8e9] px-2 py-0.5 rounded-full border border-stone-100">{title}</span>
    <div className="flex flex-col items-center space-y-3 w-full">
      <div className="flex flex-col items-center justify-center w-full pb-3 border-b border-stone-200/60 border-dashed">
        <span className="text-4xl font-bold text-stone-800 serif mb-1">{pillar.gan}</span>
        <span className="text-xs text-stone-500 font-light">{pillar.ganKr}</span>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <span className="text-4xl font-bold text-stone-800 serif mb-1">{pillar.ji}</span>
        <span className="text-xs text-stone-500 font-light">{pillar.jiKr}</span>
      </div>
    </div>
  </div>
);

const SajuChart: React.FC<SajuChartProps> = ({ pillars }) => {
  return (
    <div className="bg-[#f1f8e9] rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-stone-100 p-8 mb-8">
      <h3 className="text-xl font-bold text-stone-800 mb-6 serif flex items-center">
        <span className="bg-stone-800 w-1.5 h-6 mr-3 rounded-full opacity-80"></span>
        사주 명식 (Four Pillars)
      </h3>
      <div className="grid grid-cols-4 gap-3 sm:gap-6">
        <PillarBox title="시주 (시간)" pillar={pillars.time} />
        <PillarBox title="일주 (나)" pillar={pillars.day} />
        <PillarBox title="월주 (환경)" pillar={pillars.month} />
        <PillarBox title="연주 (뿌리)" pillar={pillars.year} />
      </div>
      <p className="text-xs text-right text-stone-400 mt-4 font-light">* 오른쪽에서 왼쪽 순서로 읽습니다.</p>
    </div>
  );
};

export default SajuChart;