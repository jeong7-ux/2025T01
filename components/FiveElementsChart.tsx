import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { FiveElements } from '../types';

interface Props {
  elements: FiveElements;
}

// Softer, more "traditional" pastel palette
const COLORS = {
  wood: '#57A6A1', // Muted Teal/Green
  fire: '#E98E88', // Soft Red/Coral
  earth: '#ECCD8A', // Muted Gold/Yellow
  metal: '#A8A29E', // Warm Gray
  water: '#7FA1C3', // Soft Blue
};

const ELEMENT_NAMES = {
  wood: '목(木)',
  fire: '화(火)',
  earth: '토(土)',
  metal: '금(金)',
  water: '수(水)',
};

const FiveElementsChart: React.FC<Props> = ({ elements }) => {
  const data = [
    { name: 'wood', value: elements.wood, label: ELEMENT_NAMES.wood },
    { name: 'fire', value: elements.fire, label: ELEMENT_NAMES.fire },
    { name: 'earth', value: elements.earth, label: ELEMENT_NAMES.earth },
    { name: 'metal', value: elements.metal, label: ELEMENT_NAMES.metal },
    { name: 'water', value: elements.water, label: ELEMENT_NAMES.water },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-[#f1f8e9] rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-stone-100 p-8 mb-8">
      <h3 className="text-xl font-bold text-stone-800 mb-6 serif flex items-center">
        <span className="bg-stone-800 w-1.5 h-6 mr-3 rounded-full opacity-80"></span>
        오행 분석 (Five Elements)
      </h3>
      
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                cornerRadius={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                 formatter={(value: number) => [`${value}%`, '비율']}
                 contentStyle={{ 
                     borderRadius: '16px', 
                     border: 'none', 
                     boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                     padding: '12px 16px',
                     backgroundColor: 'rgba(255, 255, 255, 0.95)'
                 }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                formatter={(value, entry: any) => {
                    const item = data.find(d => d.name === value);
                    return <span className="text-stone-600 font-medium ml-2 mr-2 text-sm">{item?.label}</span>
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-8">
          <div className="bg-white/80 p-6 rounded-2xl border border-stone-100/50 shadow-sm">
            <p className="text-stone-600 leading-8 whitespace-pre-wrap font-light text-sm md:text-base">
                {elements.analysis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiveElementsChart;