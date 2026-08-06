import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, BarChart2, List, ChevronDown, ChevronUp } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PhuongStatItem {
  name: string;
  value: number;
}

interface RegionalStatsCardProps {
  phuongData: PhuongStatItem[];
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#6366f1', '#14b8a6', '#f43f5e', '#a855f7'];

export default function RegionalStatsCard({ phuongData }: RegionalStatsCardProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  const [isExpanded, setIsExpanded] = useState(false);

  const totalRecords = phuongData.reduce((acc, curr) => acc + curr.value, 0);
  const displayItems = isExpanded ? phuongData : phuongData.slice(0, 6);

  return (
    <div className="glass-card p-6 flex flex-col space-y-5 justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight text-slate-800">
          <MapPin size={16} className="text-brand-accent" />
          Thống kê theo địa bàn
        </h3>
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'chart' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 size={12} /> Biểu đồ
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'list' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List size={12} /> Danh sách ({phuongData.length})
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="flex flex-col space-y-4">
          <div className="h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={phuongData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1200}
                >
                  {phuongData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`${value} hồ sơ`, 'Số lượng']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Scrollable / Collapsible Legend Container for long lists */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="max-h-36 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
              {displayItems.map((item, index) => {
                const percentage = totalRecords > 0 ? ((item.value / totalRecords) * 100).toFixed(1) : '0';
                return (
                  <div key={item.name} className="flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100/80 p-2 rounded-xl transition-colors">
                    <div className="flex items-center space-x-2 truncate mr-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-semibold">{percentage}%</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-brand-primary text-[11px] font-black">
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {phuongData.length > 6 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-1.5 text-center text-xs font-bold text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                {isExpanded ? (
                  <>Thu gọn <ChevronUp size={14} /></>
                ) : (
                  <>Xem tất cả {phuongData.length} địa bàn <ChevronDown size={14} /></>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 scrollbar-thin">
            {phuongData.map((item, index) => {
              const percentage = totalRecords > 0 ? ((item.value / totalRecords) * 100).toFixed(1) : '0';
              return (
                <div key={item.name} className="bg-slate-50 hover:bg-brand-primary/5 border border-slate-100 hover:border-brand-primary/20 p-3 rounded-2xl transition-all flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black text-xs shrink-0">
                      #{index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Tỷ trọng: {percentage}% tổng số hồ sơ</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-brand-primary">{item.value} hồ sơ</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
