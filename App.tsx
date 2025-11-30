import React, { useState } from 'react';
import { UserInput, SajuResult } from './types';
import { analyzeSaju } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [userData, setUserData] = useState<UserInput | null>(null);
  const [result, setResult] = useState<SajuResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputSubmit = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserData(data);

    try {
      const analysis = await analyzeSaju(data);
      setResult(analysis);
      setStep('result');
    } catch (err) {
      setError("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    setResult(null);
    setUserData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Background Decor - Softer Tones */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40rem] h-[40rem] bg-amber-100/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[35rem] h-[35rem] bg-stone-200/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40rem] h-[40rem] bg-orange-50/60 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {step === 'input' && (
          <>
            <InputForm onSubmit={handleInputSubmit} isLoading={isLoading} />
            {error && (
              <div className="max-w-md mx-auto mt-6 p-4 bg-red-50 text-red-800 rounded-2xl text-sm text-center border border-red-100">
                {error}
              </div>
            )}
          </>
        )}

        {step === 'result' && result && userData && (
          <ResultView 
            result={result} 
            userData={userData} 
            onReset={handleReset} 
          />
        )}
      </div>
    </div>
  );
};

export default App;