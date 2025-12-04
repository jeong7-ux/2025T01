import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { GraphData, GraphNode, GraphLink } from '../types';
import { X, Search, Filter, ZoomIn, ZoomOut, Maximize, User, FileText, FileBarChart, Presentation, Calendar, Download } from 'lucide-react';

interface AuthorGraphProps {
  data: GraphData | null;
  loading: boolean;
  onClose: () => void;
}

export const AuthorGraph: React.FC<AuthorGraphProps> = ({ data, loading, onClose }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  
  // Filters
  const [yearRange, setYearRange] = useState<[number, number]>([2015, 2024]);
  const [filterTypes, setFilterTypes] = useState({
    paper: true,
    report: true,
    presentation: true
  });

  // D3 State refs to persist across renders without re-triggering effects unnecessarily
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Initialize Graph
  useEffect(() => {
    if (!data || loading || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous
    svg.selectAll("*").remove();

    // Group for Zooming
    const g = svg.append("g");

    // Zoom Setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    zoomRef.current = zoom;

    // Filter Data
    const nodes = data.nodes.filter(n => {
        if (n.type === 'author') return true;
        if (!filterTypes[n.type as keyof typeof filterTypes] && n.type !== 'author') return false;
        if (n.year && (n.year < yearRange[0] || n.year > yearRange[1])) return false;
        return true;
    }).map(d => ({ ...d })); // Deep copy for D3 mutation

    const activeNodeIds = new Set(nodes.map(n => n.id));
    const links = data.links
        .filter(l => activeNodeIds.has(typeof l.source === 'object' ? (l.source as any).id : l.source) && activeNodeIds.has(typeof l.target === 'object' ? (l.target as any).id : l.target))
        .map(d => ({ ...d }));

    // Simulation Setup
    const simulation = d3.forceSimulation<GraphNode, GraphLink>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => getNodeSize(d) + 10));

    simulationRef.current = simulation;

    // Render Links
    const link = g.append("g")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    // Render Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(drag(simulation) as any)
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // Node Circles
    node.append("circle")
      .attr("r", d => getNodeSize(d))
      .attr("fill", d => getNodeColor(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("class", "transition-all duration-300 hover:stroke-slate-900");

    // Node Icons (Simplification: using text/emoji for icons inside SVG)
    node.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("font-family", "lucide") // Fallback
      .attr("fill", "white")
      .attr("font-size", d => Math.max(10, getNodeSize(d) / 1.5))
      .attr("pointer-events", "none")
      .text(d => getNodeIcon(d.type));

    // Labels
    node.append("text")
      .attr("dx", d => getNodeSize(d) + 5)
      .attr("dy", 4)
      .text(d => d.label.length > 15 ? d.label.substring(0, 15) + "..." : d.label)
      .attr("font-size", "12px")
      .attr("fill", "#334155")
      .style("font-weight", "500")
      .style("text-shadow", "1px 1px 0 #fff");

    // Ticks
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };

  }, [data, loading, filterTypes, yearRange]);

  // Helpers
  const getNodeSize = (node: GraphNode) => {
    if (node.type === 'author') return 30;
    const base = 10;
    const citationBonus = node.citations ? Math.min(node.citations / 2, 20) : 0;
    return base + citationBonus;
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'author': return '#4f46e5'; // Indigo 600
      case 'paper': return '#3b82f6'; // Blue 500
      case 'report': return '#10b981'; // Emerald 500
      case 'presentation': return '#f59e0b'; // Amber 500
      default: return '#64748b';
    }
  };

  const getNodeIcon = (type: string) => {
     // Unicode alternatives or simple chars
     switch (type) {
        case 'author': return ''; 
        case 'paper': return '';
        case 'report': return '';
        default: return '';
     }
  };

  // Drag Behavior
  const drag = (simulation: d3.Simulation<GraphNode, GraphLink>) => {
    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const handleZoomIn = () => {
     if (svgRef.current && zoomRef.current) {
         d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.3);
     }
  };

  const handleZoomOut = () => {
     if (svgRef.current && zoomRef.current) {
         d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.7);
     }
  };

  const handleResetZoom = () => {
     if (svgRef.current && zoomRef.current) {
         d3.select(svgRef.current).transition().call(zoomRef.current.transform, d3.zoomIdentity);
     }
  };

  if (loading) {
      return (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-fade-in">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium text-indigo-900">지식 그래프 생성 중...</p>
              <p className="text-sm text-slate-500">저자와 연구물 간의 관계를 분석하고 있습니다.</p>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-40 flex bg-slate-50 animate-fade-in">
      {/* Sidebar Controls */}
      <div className="w-80 bg-white border-r border-slate-200 shadow-xl flex flex-col z-10">
        <div className="p-5 border-b border-slate-200 bg-indigo-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="p-1 bg-white/20 rounded">🕸️</span> 연구물 네트워크
            </h2>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-indigo-100">
             {data?.centralAuthor.name} ({data?.centralAuthor.affiliation})
          </p>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">그래프 내 검색</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="제목 또는 키워드..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          {/* Types Filter */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase mb-3">
               <Filter className="w-3 h-3" /> 연구물 유형
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer p-2 rounded hover:bg-slate-50">
                 <input type="checkbox" checked={filterTypes.paper} onChange={e => setFilterTypes({...filterTypes, paper: e.target.checked})} className="rounded text-indigo-600" />
                 <span className="w-3 h-3 rounded-full bg-blue-500"></span> 학술 논문
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer p-2 rounded hover:bg-slate-50">
                 <input type="checkbox" checked={filterTypes.report} onChange={e => setFilterTypes({...filterTypes, report: e.target.checked})} className="rounded text-indigo-600" />
                 <span className="w-3 h-3 rounded-full bg-emerald-500"></span> 연구 보고서
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer p-2 rounded hover:bg-slate-50">
                 <input type="checkbox" checked={filterTypes.presentation} onChange={e => setFilterTypes({...filterTypes, presentation: e.target.checked})} className="rounded text-indigo-600" />
                 <span className="w-3 h-3 rounded-full bg-amber-500"></span> 발표 자료
              </label>
            </div>
          </div>

          {/* Year Range */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase mb-3">
               <Calendar className="w-3 h-3" /> 발행 연도 ({yearRange[0]} - {yearRange[1]})
            </label>
            <input 
              type="range" 
              min="2010" 
              max="2024" 
              value={yearRange[0]}
              onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
            />
             <div className="flex justify-between text-xs text-slate-400 mt-1">
               <span>2010</span>
               <span>2024</span>
             </div>
          </div>

          {/* Stats */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
             <div className="text-xs text-slate-500 mb-1">총 노드 수</div>
             <div className="text-xl font-bold text-slate-800">{data?.nodes.length}</div>
             <div className="text-xs text-slate-500 mt-2 mb-1">총 연결 수</div>
             <div className="text-xl font-bold text-slate-800">{data?.links.length}</div>
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 relative bg-slate-50 overflow-hidden" ref={containerRef}>
         <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
         
         {/* Toolbar */}
         <div className="absolute top-5 right-5 flex flex-col gap-2 bg-white rounded-lg shadow-md border border-slate-200 p-1">
            <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="확대"><ZoomIn className="w-5 h-5" /></button>
            <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="축소"><ZoomOut className="w-5 h-5" /></button>
            <button onClick={handleResetZoom} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="화면 맞춤"><Maximize className="w-5 h-5" /></button>
         </div>

         {/* Legend */}
         <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur rounded-lg p-3 shadow-sm border border-slate-200 text-xs flex gap-4">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-600"></span> 저자</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> 논문</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> 보고서</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> 발표</div>
         </div>
      </div>

      {/* Detail Panel (Slide Over) */}
      {selectedNode && (
        <div className="w-96 bg-white border-l border-slate-200 shadow-2xl overflow-y-auto z-20 animate-slide-in-right">
           <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                 <div className={`p-2 rounded-lg ${selectedNode.type === 'author' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                    {selectedNode.type === 'author' ? <User className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                 </div>
                 <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{selectedNode.label}</h3>
              
              {selectedNode.type !== 'author' && (
                  <div className="flex gap-2 mb-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">{selectedNode.year}</span>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">인용 {selectedNode.citations}회</span>
                  </div>
              )}

              {selectedNode.metadata && (
                <div className="space-y-4">
                   {selectedNode.metadata.journal && (
                       <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">저널/발행처</h4>
                          <p className="text-sm text-slate-800">{selectedNode.metadata.journal}</p>
                       </div>
                   )}
                   {selectedNode.metadata.abstract && (
                       <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">초록/요약</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{selectedNode.metadata.abstract}</p>
                       </div>
                   )}
                </div>
              )}
              
              {selectedNode.type !== 'author' && (
                  <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                          <Download className="w-4 h-4" /> 원문 보기
                      </button>
                      <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                          <FileBarChart className="w-4 h-4" /> 상세 분석
                      </button>
                  </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
