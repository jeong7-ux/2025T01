import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Smartphone, Fingerprint, RefreshCw } from 'lucide-react';
import { AuthView, User as UserType } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
  onClose: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onClose }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // 비밀번호 정책 검증
  const isPasswordValid = password.length >= 8;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 백엔드 통신 시뮬레이션
    setTimeout(() => {
      const mockUser: UserType = {
        id: 'user-123',
        email: email || 'user@example.com',
        name: '김연구',
        authMethods: ['email'],
        joinDate: new Date().toISOString(),
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
       const mockUser: UserType = {
        id: `user-${provider}-123`,
        email: `user@${provider}.com`,
        name: `김${provider}`,
        authMethods: [provider as any],
        joinDate: new Date().toISOString(),
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center relative">
          <h2 className="text-2xl font-bold text-white mb-1">
            {view === 'LOGIN' && '환영합니다'}
            {view === 'REGISTER' && '회원가입'}
            {view === 'FORGOT_PASSWORD' && '비밀번호 찾기'}
          </h2>
          <p className="text-indigo-100 text-sm">
            {view === 'LOGIN' && '스칼라마인드에 오신 것을 환영합니다.'}
            {view === 'REGISTER' && '연구 여정을 시작하세요.'}
            {view === 'FORGOT_PASSWORD' && '가입한 이메일을 입력해주세요.'}
          </p>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          {view === 'LOGIN' && (
            <>
              {/* Social Login Buttons */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <button onClick={() => handleSocialLogin('kakao')} className="aspect-square flex flex-col items-center justify-center bg-[#FEE500] hover:bg-[#FDD835] rounded-xl transition-colors p-2 group">
                   <span className="font-bold text-[#371D1E] text-xs">Kakao</span>
                </button>
                <button onClick={() => handleSocialLogin('naver')} className="aspect-square flex flex-col items-center justify-center bg-[#03C75A] hover:bg-[#02b351] rounded-xl transition-colors p-2">
                   <span className="font-bold text-white text-xs">Naver</span>
                </button>
                <button onClick={() => handleSocialLogin('google')} className="aspect-square flex flex-col items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors p-2">
                   <span className="font-bold text-slate-600 text-xs">Google</span>
                </button>
                <button onClick={() => handleSocialLogin('apple')} className="aspect-square flex flex-col items-center justify-center bg-black hover:bg-gray-800 rounded-xl transition-colors p-2">
                   <span className="font-bold text-white text-xs">Apple</span>
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">또는 이메일로 로그인</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">비밀번호</label>
                    <button 
                      type="button" 
                      onClick={() => setView('FORGOT_PASSWORD')}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      비밀번호를 잊으셨나요?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                  <input type="checkbox" id="remember" className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="remember">로그인 상태 유지</label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : '로그인'}
                </button>

                {/* Biometric Placeholder for Mobile Phase */}
                <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
                  <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="지문 로그인">
                    <Fingerprint className="w-6 h-6" />
                  </button>
                  <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Face ID">
                    <Smartphone className="w-6 h-6" />
                  </button>
                </div>
              </form>
            </>
          )}

          {view === 'REGISTER' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="홍길동"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="user@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${password && !isPasswordValid ? 'border-red-300' : 'border-slate-300'}`}
                    placeholder="8자 이상, 특수문자 포함"
                  />
                </div>
                <div className="mt-1 flex items-center gap-1">
                   <div className={`h-1 flex-1 rounded-full ${password.length > 0 ? (password.length >= 8 ? 'bg-green-500' : 'bg-red-400') : 'bg-slate-200'}`}></div>
                   <div className={`h-1 flex-1 rounded-full ${password.length >= 10 ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                   <div className={`h-1 flex-1 rounded-full ${/[!@#$%^&*]/.test(password) ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">최소 8자 이상, 영문/숫자/특수문자 포함</p>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-lg shadow-indigo-200"
              >
                {isLoading ? '가입 처리중...' : '회원가입 완료'}
              </button>
            </form>
          )}

          {view === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="user@example.com"
                />
              </div>
              <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium">
                재설정 링크 발송
              </button>
            </div>
          )}

          {/* Footer View Switcher */}
          <div className="mt-6 text-center text-sm">
            {view === 'LOGIN' ? (
              <p className="text-slate-600">
                아직 계정이 없으신가요?{' '}
                <button onClick={() => setView('REGISTER')} className="text-indigo-600 font-semibold hover:underline">
                  회원가입
                </button>
              </p>
            ) : (
              <p className="text-slate-600">
                이미 계정이 있으신가요?{' '}
                <button onClick={() => setView('LOGIN')} className="text-indigo-600 font-semibold hover:underline">
                  로그인
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
