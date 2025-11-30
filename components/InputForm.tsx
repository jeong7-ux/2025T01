import React, { useState, useEffect } from 'react';
import { UserInput, Gender } from '../types';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Local state for date parts
  const [year, setYear] = useState<number>(1990);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  // Local state for time parts
  const [isTimeUnknown, setIsTimeUnknown] = useState<boolean>(false);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);

  const [formData, setFormData] = useState<Omit<UserInput, 'birthDate' | 'birthTime'>>({
    name: '',
    gender: Gender.MALE
  });

  // Update days when year or month changes
  useEffect(() => {
    const lastDay = new Date(year, month, 0).getDate();
    const daysArray = Array.from({ length: lastDay }, (_, i) => i + 1);
    setDaysInMonth(daysArray);
    
    // Adjust day if it exceeds the new month's max day
    if (day > lastDay) {
      setDay(lastDay);
    }
  }, [year, month]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (gender: Gender) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const toggleAmpm = (value: 'AM' | 'PM') => {
    if (!isTimeUnknown) {
      setAmpm(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    let formattedTime = '모름';
    
    if (!isTimeUnknown) {
      let h = hour;
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      formattedTime = `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    
    onSubmit({
      ...formData,
      birthDate: formattedDate,
      birthTime: formattedTime
    });
  };

  return (
    <div className="max-w-md mx-auto bg-[#f1f8e9]/95 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100/50">
      <div className="text-center mb-10">
        <div className="inline-block p-3 rounded-full bg-white mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8bc34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        </div>
        <h2 className="text-3xl font-bold text-stone-800 serif mb-2 tracking-tight">운명의 나침반</h2>
        <p className="text-stone-500 text-sm font-light">당신의 생년월일이 들려주는 이야기</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2 pl-1">이름 (선택)</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="홍길동"
            className="w-full px-5 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#8bc34a] focus:border-transparent outline-none transition-all placeholder-stone-400 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2 pl-1">생년월일 (양력)</label>
          <div className="flex space-x-2">
            <div className="w-1/3 relative">
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full appearance-none px-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#8bc34a] outline-none transition-all text-stone-700 cursor-pointer shadow-sm"
                >
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            <div className="w-1/3 relative">
                <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full appearance-none px-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#8bc34a] outline-none transition-all text-stone-700 cursor-pointer shadow-sm"
                >
                    {months.map(m => <option key={m} value={m}>{m}월</option>)}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            <div className="w-1/3 relative">
                <select
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                    className="w-full appearance-none px-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#8bc34a] outline-none transition-all text-stone-700 cursor-pointer shadow-sm"
                >
                    {daysInMonth.map(d => <option key={d} value={d}>{d}일</option>)}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2 pl-1">태어난 시간</label>
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
             {/* Time Controls */}
             <div className={`space-y-3 transition-opacity duration-300 ${isTimeUnknown ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                {/* AM/PM Checkboxes */}
                <div className="flex space-x-4 mb-3">
                   <div 
                      onClick={() => toggleAmpm('AM')}
                      className="flex items-center cursor-pointer group select-none"
                   >
                       <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${ampm === 'AM' ? 'bg-blue-500 border-blue-500' : 'border-stone-300 bg-white group-hover:border-blue-300'}`}>
                           {ampm === 'AM' && (
                               <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                               </svg>
                           )}
                       </div>
                       <span className={`ml-2 text-sm ${ampm === 'AM' ? 'text-stone-800 font-medium' : 'text-stone-500'}`}>오전</span>
                   </div>

                   <div 
                      onClick={() => toggleAmpm('PM')}
                      className="flex items-center cursor-pointer group select-none"
                   >
                       <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${ampm === 'PM' ? 'bg-blue-500 border-blue-500' : 'border-stone-300 bg-white group-hover:border-blue-300'}`}>
                           {ampm === 'PM' && (
                               <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                               </svg>
                           )}
                       </div>
                       <span className={`ml-2 text-sm ${ampm === 'PM' ? 'text-stone-800 font-medium' : 'text-stone-500'}`}>오후</span>
                   </div>
                </div>

                {/* Hour/Minute Selects */}
                <div className="flex space-x-2">
                    <div className="w-1/2 relative">
                        <select
                            value={hour}
                            onChange={(e) => setHour(Number(e.target.value))}
                            disabled={isTimeUnknown}
                            className="w-full appearance-none px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#8bc34a] outline-none transition-all text-stone-700 cursor-pointer text-center"
                        >
                            {hours.map(h => <option key={h} value={h}>{h}시</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400">
                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    <div className="w-1/2 relative">
                        <select
                            value={minute}
                            onChange={(e) => setMinute(Number(e.target.value))}
                            disabled={isTimeUnknown}
                            className="w-full appearance-none px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#8bc34a] outline-none transition-all text-stone-700 cursor-pointer text-center"
                        >
                            {minutes.map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}분</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400">
                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
             </div>

             {/* Unknown Checkbox - Moved to Bottom */}
             <div 
                className="flex items-center mt-5 cursor-pointer"
                onClick={() => setIsTimeUnknown(!isTimeUnknown)}
             >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all mr-2 ${isTimeUnknown ? 'bg-stone-500 border-stone-500' : 'bg-white border-stone-300'}`}>
                    {isTimeUnknown && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                       </svg>
                    )}
                </div>
                <span className="text-sm text-stone-600 select-none">시간을 모릅니다</span>
             </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-3 pl-1">성별</label>
          <div className="flex space-x-6 pl-1">
            <div 
                onClick={() => handleGenderChange(Gender.MALE)}
                className="flex items-center cursor-pointer group select-none"
            >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.gender === Gender.MALE ? 'bg-blue-500 border-blue-500' : 'border-stone-300 bg-white group-hover:border-blue-300'}`}>
                   {formData.gender === Gender.MALE && (
                       <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                       </svg>
                   )}
                </div>
                <span className={`ml-2 text-base ${formData.gender === Gender.MALE ? 'text-stone-800 font-medium' : 'text-stone-500'}`}>남성</span>
            </div>

            <div 
                onClick={() => handleGenderChange(Gender.FEMALE)}
                className="flex items-center cursor-pointer group select-none"
            >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.gender === Gender.FEMALE ? 'bg-blue-500 border-blue-500' : 'border-stone-300 bg-white group-hover:border-blue-300'}`}>
                   {formData.gender === Gender.FEMALE && (
                       <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                       </svg>
                   )}
                </div>
                <span className={`ml-2 text-base ${formData.gender === Gender.FEMALE ? 'text-stone-800 font-medium' : 'text-stone-500'}`}>여성</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-[80%] mx-auto block py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-2xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              운명 분석 중...
            </span>
          ) : '확인하기'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;