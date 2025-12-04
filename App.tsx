import React, { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, Loader2, BookOpen, User, Github, LogIn } from 'lucide-react';
import { Paper, SearchFilters, ViewState, User as UserType, GraphData } from './types';
import { searchPapersWithGemini, getAuthorNetwork } from './services/geminiService';
import { PaperCard } from './components/PaperCard';
import { PaperDetail } from './components/PaperDetail';
import { Auth } from './components/Auth';
import { UserProfile } from './components/UserProfile';
import { AuthorGraph } from './components/AuthorGraph';

function App() {
  // --- State ---
  const [view, setView] = useState<ViewState>('HOME');
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Graph State
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [graphLoading, setGraphLoading] = useState(false);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    isOpenAccessOnly: false,
    isReviewOnly: false,
    sortBy: 'relevance'
  });

  // --- Handlers ---
  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setView('RESULTS');
    try {
      const results = await searchPapersWithGemini(query, filters);
      setPapers(results);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  }, [query, filters]);

  const handlePaperClick = (paper: Paper) => {
    setSelectedPaper(paper);
    setView('DETAIL');
    window.scrollTo(0,0);
  };

  const handleBackToResults = () => {
    setView('RESULTS');
    setSelectedPaper(null);
  };

  const handleLogoClick = () => {
    setView('HOME');
    setQuery('');
    setPapers([]);
    setSelectedPaper(null);
    setGraphData(null);
  };

  // --- Auth Handlers ---
  const handleLoginSuccess = (loggedInUser: UserType) => {
    setUser(loggedInUser);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfileModal(false);
    setView('HOME');
  };

  // --- Graph Handlers ---
  const handleAuthorClick = async (authorName: string) => {
    setGraphLoading(true);
    // Switch to graph view immediately to show loading state there or use a modal overlay
    // For this implementation, we will render AuthorGraph component over the current view
    setView('GRAPH');
    
    try {
        const data = await getAuthorNetwork(authorName);
        setGraphData(data);
    } catch (error) {
        console.error("Graph fetch failed", error);
        setView('DETAIL'); // Fallback
    } finally {
        setGraphLoading(false);
    }
  };

  const handleCloseGraph = () => {
      setView(selectedPaper ? 'DETAIL' : 'RESULTS');
      setGraphData(null);
  };

  // --- Render Helpers ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in-up">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl rotate-3 hover:rotate-6 transition-transform">
         <BookOpen className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center tracking-tight">
        스칼라<span className="text-indigo-600">마인드</span>
      </h1>
      <p className="text-lg text-slate-500 mb-10 max-w-2xl text-center leading-relaxed word-keep-all">
        AI 기반 학술 검색 엔진. 수백만 건의 논문을 맥락 인식 검색과 심층 분석으로 탐색하세요.
      </p>

      <div className="w-full max-w-2xl relative z-10">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="논문, 저자 또는 주제 검색 (예: 'CRISPR', '인공지능')..."
            className="w-full pl-6 pr-14 py-4 text-lg rounded-full border-2 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
          </button>
        </form>
        
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
           <span>추천 검색어:</span>
           <button onClick={() => { setQuery('mRNA 백신'); handleSearch(); }} className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors">mRNA 백신</button>
           <button onClick={() => { setQuery('양자 컴퓨터'); handleSearch(); }} className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors">양자 컴퓨터</button>
           <button onClick={() => { setQuery('기후 변화 적응'); handleSearch(); }} className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors">기후 변화</button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">검색 필터</h3>
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">발행 연도</label>
                <div className="grid grid-cols-2 gap-2">
                   <input type="number" placeholder="부터" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500" />
                   <input type="number" placeholder="까지" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.isOpenAccessOnly} 
                    onChange={e => setFilters(prev => ({...prev, isOpenAccessOnly: e.target.checked}))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" 
                  />
                  <span className="text-sm text-slate-600">오픈 액세스만 보기</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.isReviewOnly} 
                    onChange={e => setFilters(prev => ({...prev, isReviewOnly: e.target.checked}))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" 
                  />
                  <span className="text-sm text-slate-600">리뷰 논문만 보기</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">정렬 기준</label>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({...prev, sortBy: e.target.value as any}))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                >
                  <option value="relevance">관련도순</option>
                  <option value="newest">최신순</option>
                  <option value="citations">인용 많은 순</option>
                </select>
              </div>
              
              <button 
                onClick={() => handleSearch()}
                className="w-full py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors"
              >
                필터 적용
              </button>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              "<span className="text-indigo-600">{query}</span>" 검색 결과
            </h2>
            <button 
              className="md:hidden p-2 text-slate-500"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
             <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 animate-pulse">
                   <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                   <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                   <div className="space-y-2">
                     <div className="h-4 bg-slate-200 rounded w-full"></div>
                     <div className="h-4 bg-slate-200 rounded w-full"></div>
                     <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                   </div>
                 </div>
               ))}
             </div>
          ) : papers.length > 0 ? (
            <div className="space-y-4">
              {papers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} onClick={handlePaperClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">검색 결과가 없습니다</h3>
              <p className="text-slate-500 mt-1">검색어나 필터를 조정해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header (Sticky if not home) */}
      <header className={`bg-white border-b border-slate-200 sticky top-0 z-40 transition-all ${view === 'HOME' ? 'border-transparent bg-transparent' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
             </div>
             <span className={`text-xl font-bold tracking-tight ${view === 'HOME' ? 'opacity-0' : 'text-slate-900'}`}>
               스칼라<span className="text-indigo-600">마인드</span>
             </span>
          </div>
          
          {view !== 'HOME' && (
             <div className="flex-1 max-w-xl mx-8 hidden md:block">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-slate-100 border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition-all"
                    placeholder="검색..."
                  />
                  <button type="submit" className="absolute right-2 top-2 text-slate-400 hover:text-indigo-600">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
             </div>
          )}

          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-indigo-600 transition-colors hidden sm:block">
              <Github className="w-5 h-5" />
            </button>
            
            {user ? (
              <div 
                className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors"
                onClick={() => setShowProfileModal(true)}
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden md:block">{user.name}</span>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>로그인</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`${view === 'HOME' ? 'pt-10' : ''}`}>
        {view === 'HOME' && renderHome()}
        {view === 'RESULTS' && renderResults()}
        {view === 'DETAIL' && selectedPaper && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PaperDetail 
              paper={selectedPaper} 
              onBack={handleBackToResults}
              onNavigateToPaper={handlePaperClick}
              onAuthorClick={handleAuthorClick}
            />
          </div>
        )}
        {view === 'GRAPH' && (
            <AuthorGraph 
                data={graphData} 
                loading={graphLoading} 
                onClose={handleCloseGraph} 
            />
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <Auth 
          onLogin={handleLoginSuccess} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && user && (
        <UserProfile 
          user={user} 
          onLogout={handleLogout} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
      
      {/* Footer */}
      {view === 'HOME' && (
         <footer className="w-full py-8 text-center text-slate-400 text-sm">
           <p>© {new Date().getFullYear()} ScholarMind Prototype. Powered by Gemini.</p>
         </footer>
      )}
    </div>
  );
}

export default App;
