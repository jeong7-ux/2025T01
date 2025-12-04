import React, { useState } from 'react';
import { User, Shield, Smartphone, LogOut, Mail, Lock, CheckCircle, Bell } from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  onLogout: () => void;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onClose }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY'>('PROFILE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row h-[600px] md:h-auto min-h-[500px]">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 p-6 border-r border-slate-100 flex flex-col">
           <div className="flex items-center gap-3 mb-8">
             <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
               {user.name.charAt(0)}
             </div>
             <div>
               <h3 className="font-bold text-slate-900">{user.name}</h3>
               <p className="text-xs text-slate-500">Free Plan</p>
             </div>
           </div>

           <nav className="space-y-1 flex-1">
             <button 
               onClick={() => setActiveTab('PROFILE')}
               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'PROFILE' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
             >
               <User className="w-4 h-4" />
               기본 정보
             </button>
             <button 
               onClick={() => setActiveTab('SECURITY')}
               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'SECURITY' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
             >
               <Shield className="w-4 h-4" />
               로그인 및 보안
             </button>
             <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
               <Bell className="w-4 h-4" />
               알림 설정
             </button>
           </nav>

           <div className="mt-auto pt-4 border-t border-slate-200">
             <button 
               onClick={onLogout}
               className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
             >
               <LogOut className="w-4 h-4" />
               로그아웃
             </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto relative">
           <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
           
           {activeTab === 'PROFILE' && (
             <div className="space-y-6 animate-fade-in">
               <h2 className="text-xl font-bold text-slate-900">프로필 설정</h2>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
                   <input type="text" value={user.name} readOnly className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                   <div className="flex gap-2">
                      <input type="text" value={user.email} readOnly className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600" />
                      <span className="inline-flex items-center px-3 rounded-lg bg-green-100 text-green-700 text-xs font-bold">
                        <CheckCircle className="w-3 h-3 mr-1" /> 인증됨
                      </span>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">소속</label>
                   <input type="text" placeholder="대학교/연구소 입력" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
               </div>
               
               <div className="pt-6 border-t border-slate-100">
                 <h3 className="text-sm font-semibold text-slate-900 mb-4">연결된 계정</h3>
                 <div className="flex gap-3">
                   {['kakao', 'google', 'naver'].map(provider => (
                     <div key={provider} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${user.authMethods.includes(provider as any) ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-400 grayscale'}`}>
                       <span className="capitalize">{provider}</span>
                       {user.authMethods.includes(provider as any) && <CheckCircle className="w-3 h-3" />}
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'SECURITY' && (
             <div className="space-y-6 animate-fade-in">
               <h2 className="text-xl font-bold text-slate-900">보안 설정</h2>
               
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-white rounded-lg border border-slate-200">
                       <Lock className="w-5 h-5 text-indigo-600" />
                     </div>
                     <div>
                       <div className="font-semibold text-slate-900">비밀번호 변경</div>
                       <div className="text-xs text-slate-500">마지막 변경: 3개월 전</div>
                     </div>
                   </div>
                   <button className="text-sm text-indigo-600 font-medium hover:underline">변경</button>
                 </div>
                 
                 <div className="border-t border-slate-200 my-2"></div>

                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-white rounded-lg border border-slate-200">
                       <Smartphone className="w-5 h-5 text-indigo-600" />
                     </div>
                     <div>
                       <div className="font-semibold text-slate-900">2단계 인증 (2FA)</div>
                       <div className="text-xs text-slate-500">계정 보호를 위해 설정 추천</div>
                     </div>
                   </div>
                   <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">설정</button>
                 </div>
               </div>

               <div>
                 <h3 className="text-sm font-semibold text-slate-900 mb-3">로그인된 기기</h3>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">iPhone 14 Pro</div>
                          <div className="text-xs text-slate-500">서울, 대한민국 • 지금 활동 중</div>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">현재 기기</span>
                   </div>
                   <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex justify-center"><span className="text-slate-400">💻</span></div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">Chrome on Windows</div>
                          <div className="text-xs text-slate-500">판교, 대한민국 • 2일 전</div>
                        </div>
                      </div>
                      <button className="text-xs text-red-500 hover:text-red-700">로그아웃</button>
                   </div>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
