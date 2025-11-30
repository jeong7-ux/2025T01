import React, { useState } from 'react';
import { UserInput, Gender } from '../types';
import { Sparkles, Calendar, Clock, User } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [gender, setGender] = useState<Gender>(Gender.MALE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      birthDate,
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

        {/* Date Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-amber-500" />
            생년월일 (양력)
          </label>
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white outline-none transition-all"
          />
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
          disabled={isLoading || !birthDate}
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