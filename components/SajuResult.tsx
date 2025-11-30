import React from 'react';
import { SajuResponse, Pillar } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Scroll, Heart, Briefcase, Wallet, Activity, Info } from 'lucide-react';

interface SajuResultProps {
  data: SajuResponse;
  userName?: string;
  onReset: () => void;
}

const PillarCard: React.FC<{ title: string; pillar: Pillar }> = ({ title, pillar }) => (
  <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl p-4 min-w-[80px]">
    <span className="text-xs text-gray-400 mb-2">{title}</span>
    <div className="flex flex-col items-center space-y-2">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold serif text-amber-200">{pillar.gan}</span>
        <span className="text-[10px] text-gray-500">{pillar.ganElement}</span>
      </div>
      <div className="w-8 h-[1px] bg-white/10" />
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold serif text-amber-200">{pillar.ji}</span>
        <span className="text-[10px] text-gray-500">{pillar.jiElement}</span>
      </div>
    </div>
  </div>
);

const FortuneCard: React.FC<{ title: string; content: string; score: number; icon: React.ReactNode }> = ({ title, content, score, icon }) => (
  <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 hover:border-amber-500/30 transition-all">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2 text-amber-400">
        {icon}
        <h4 className="font-bold">{title}</h4>
      </div>
      <div className="flex items-center gap-1">
        <div className="text-xs text-gray-400">운세지수</div>
        <span className="text-sm font-bold text-white bg-amber-600/20 px-2 py-0.5 rounded border border-amber-600/30">
          {score}
        </span>
      </div>
    </div>
    <p className="text-gray-300 text-sm leading-relaxed text-justify">{content}</p>
  </div>
);

const SajuResult: React.FC<SajuResultProps> = ({ data, userName, onReset }) => {
  const elementData = [
    { subject: '목(木)', A: data.elements.wood, fullMark: 100 },
    { subject: '화(火)', A: data.elements.fire, fullMark: 100 },
    { subject: '토(土)', A: data.elements.earth, fullMark: 100 },
    { subject: '금(金)', A: data.elements.metal, fullMark: 100 },
    { subject: '수(水)', A: data.elements.water, fullMark: 100 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold serif text-amber-500">
          {userName ? `${userName}님의 ` : ''}운명 분석서
        </h2>
        <p className="text-gray-400 text-sm">천지기운의 흐름을 읽어 전해드립니다.</p>
      </div>

      {/* 1. Saju Pillars (Four Pillars) */}
      <div className="bg-gray-900/60 rounded-2xl p-6 border border-amber-900/30 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <Scroll className="text-amber-500 w-5 h-5" />
          <h3 className="text-lg font-bold text-gray-200">사주 팔자 (四柱八字)</h3>
        </div>
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          <PillarCard title="시주 (말년)" pillar={data.saju.hour} />
          <PillarCard title="일주 (본인)" pillar={data.saju.day} />
          <PillarCard title="월주 (청년)" pillar={data.saju.month} />
          <PillarCard title="연주 (초년)" pillar={data.saju.year} />
        </div>
      </div>

      {/* 2. Elements Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-amber-500 w-5 h-5" />
            <h3 className="text-lg font-bold text-gray-200">오행 균형 분석</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={elementData}>
                <PolarGrid stroke="#4b5563" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="오행"
                  dataKey="A"
                  stroke="#d97706"
                  fill="#d97706"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-300 bg-black/20 p-3 rounded-lg border border-white/5">
            <p className="mb-1"><span className="text-amber-400 font-bold">강한 기운:</span> {data.elements.strongest}</p>
            <p><span className="text-blue-400 font-bold">약한 기운:</span> {data.elements.weakest}</p>
            <p className="mt-2 text-gray-400 text-xs">{data.elements.description}</p>
          </div>
        </div>

        {/* 3. Timeline */}
        <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800 shadow-xl flex flex-col justify-between">
           <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="text-amber-500 w-5 h-5" />
            <h3 className="text-lg font-bold text-gray-200">운세 흐름</h3>
          </div>
          <div className="space-y-4">
            <div className="border-l-2 border-amber-600 pl-4 py-1">
              <span className="text-xs text-amber-500 block mb-1">오늘의 운세</span>
              <p className="text-sm text-gray-200">{data.timeline.today}</p>
            </div>
            <div className="border-l-2 border-gray-600 pl-4 py-1">
              <span className="text-xs text-gray-400 block mb-1">이번 달 흐름</span>
              <p className="text-sm text-gray-300">{data.timeline.thisMonth}</p>
            </div>
            <div className="border-l-2 border-gray-600 pl-4 py-1">
              <span className="text-xs text-gray-400 block mb-1">올해의 총평</span>
              <p className="text-sm text-gray-300">{data.timeline.thisYear}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Detailed Fortunes */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-amber-500 serif px-2">상세 풀이</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <FortuneCard 
            title="재물운" 
            content={data.fortunes.wealth.content} 
            score={data.fortunes.wealth.score} 
            icon={<Wallet className="w-4 h-4" />} 
          />
          <FortuneCard 
            title="직업/학업운" 
            content={data.fortunes.career.content} 
            score={data.fortunes.career.score} 
            icon={<Briefcase className="w-4 h-4" />} 
          />
          <FortuneCard 
            title="애정운" 
            content={data.fortunes.love.content} 
            score={data.fortunes.love.score} 
            icon={<Heart className="w-4 h-4" />} 
          />
          <FortuneCard 
            title="건강운" 
            content={data.fortunes.health.content} 
            score={data.fortunes.health.score} 
            icon={<Activity className="w-4 h-4" />} 
          />
        </div>
      </div>

      {/* 5. Final Advice */}
      <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6 text-center">
        <h3 className="text-amber-400 font-bold mb-3 serif text-lg">마음을 위한 조언</h3>
        <p className="text-gray-200 leading-relaxed italic">"{data.advice}"</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full border border-gray-600 transition-colors text-sm font-medium"
        >
          다른 생년월일 입력하기
        </button>
      </div>

      {/* Disclaimer */}
      <div className="text-center pt-8 pb-4 border-t border-white/5">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-xs mb-1">
          <Info className="w-3 h-3" />
          <span>안내사항</span>
        </div>
        <p className="text-[10px] text-gray-600">
          ※ 본 해석은 전통 명리학 이론을 바탕으로 AI가 생성한 오락용 콘텐츠입니다.<br/>
          과학적 근거가 없으며, 삶의 중요한 결정은 본인의 의지로 판단하시기 바랍니다.
        </p>
      </div>
    </div>
  );
};

// Helper component for icon
const ClockIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default SajuResult;