import React, { useState } from 'react';
import InputForm from './components/InputForm';
import SajuResult from './components/SajuResult';
import { UserInput, SajuResponse } from './types';
import { generateSajuReport } from './services/geminiService';
import { Moon } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [userData, setUserData] = useState<UserInput | null>(null);
  const [resultData, setResultData] = useState<SajuResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputSubmit = async (data: UserInput) => {
    setUserData(data);
    setStep('loading');
    setError(null);

    try {
      const result = await generateSajuReport(data);
      setResultData(result);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError("운세를 불러오는 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setStep('input');
    }
  };

  const handleReset = () => {
    setUserData(null);
    setResultData(null);
    setStep('input');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-neutral-900 to-black text-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="w-full border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-600 p-1.5 rounded-lg">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight serif text-amber-500">명리 AI</h1>
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">
            전통 사주 & 토종비결 해석
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-6xl mx-auto">
        {step === 'input' && (
          <div className="w-full animate-fade-in-up">
            <InputForm onSubmit={handleInputSubmit} isLoading={false} />
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-500/30 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-amber-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Moon className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-400 serif mb-2">운명의 지도를 그리는 중...</h3>
              <p className="text-gray-500 text-sm">생년월일을 바탕으로 사주팔자와 오행을 분석하고 있습니다.</p>
            </div>
          </div>
        )}

        {step === 'result' && resultData && (
          <SajuResult 
            data={resultData} 
            userName={userData?.name} 
            onReset={handleReset} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-600 text-xs border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} Myungri AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;