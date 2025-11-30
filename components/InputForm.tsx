import React, { useState, useEffect } from 'react';
import { UserInput, Gender } from '../types';
import { Sparkles, Calendar, Clock, User } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  
  // Date selection state
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  
  const [birthTime, setBirthTime] = useState('');
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [gender, setGender] = useState<Gender>(Gender.MALE);

  // Generate arrays for dropdowns
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Current year down 100 years
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const getDaysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);

  // Ensure day is valid when month/year changes (e.g., Feb 31 -> Feb 28)
  useEffect(() => {
    const maxDay = getDaysInMonth(year, month);
    if (day > maxDay) {
      setDay(maxDay);
    }
  }, [year, month, day]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format date as YYYY-MM-DD
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    onSubmit({
      name,
      birthDate: formattedDate,
      birthTime: isTimeUnknown ? 'unknown' : birthTime,
      gender
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-500 serif mb-2">사주 명리 분석</h2>
        <p className="text-gray-400 text-sm">당신의 생년월일을 입력하여<br/>천기와 운명의 흐름을 확인하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-300">
            <User className="w-4 h-4 mr-2 text-amber-500" />
            이름 (선택)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-600 outline-none transition-all"
          />
        </div>

        {/* Date Input (Combo Boxes) */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-amber-500" />
            생년월일 (양력)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Year Select */}
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white outline-none appearance-none cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}년</option>
                ))}
              </select>
            </div>

            {/* Month Select */}
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white outline-none appearance-none cursor-pointer"
              >
                {months.map((m) => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
            </div>

            {/* Day Select */}
            <div className="relative">
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white outline-none appearance-none cursor-pointer"
              >
                {days.map((d) => (
                  <option key={d} value={d}>{d}일</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Time Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-amber-500" />
            태어난 시간
          </label>
          <div className="flex gap-4">
            <input
              type="time"
              disabled={isTimeUnknown}
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className={`flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white outline-none transition-all ${isTimeUnknown ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isTimeUnknown}
                onChange={(e) => setIsTimeUnknown(e.target.checked)}
                className="w-5 h-5 rounded border-gray-700 text-amber-500 focus:ring-amber-500 bg-gray-900"
              />
              <span className="text-sm text-gray-400">모름</span>
            </label>
          </div>
        </div>

        {/* Gender Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block">성별</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setGender(Gender.MALE)}
              className={`py-3 rounded-lg border transition-all ${
                gender === Gender.MALE
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:bg-gray-800'
              }`}
            >
              남성
            </button>
            <button
              type="button"
              onClick={() => setGender(Gender.FEMALE)}
              className={`py-3 rounded-lg border transition-all ${
                gender === Gender.FEMALE
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:bg-gray-800'
              }`}
            >
              여성
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>천기 누설 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>운세 확인하기</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;