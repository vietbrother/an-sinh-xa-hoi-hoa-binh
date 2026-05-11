import React, { useMemo } from 'react';
import { useRecords } from '../RecordContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Users, Clock, MapPin, 
  TrendingUp, Activity, ShieldCheck 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { records, isLoading } = useRecords();

  const stats = useMemo(() => {
    const total = records.length;
    const processing = records.filter(r => r.resolutionStatus === 'Đang xử lý').length;
    const completed = records.filter(r => r.resolutionStatus === 'Hoàn thành').length;
    
    // Stats by Phuong
    const phuongStats = records.reduce((acc, current) => {
      const phuong = current.phuong || 'Khác';
      acc[phuong] = (acc[phuong] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const phuongData = Object.entries(phuongStats).map(([name, value]) => ({ name, value }));

    // Stats by Type (Category)
    const categoryStats = records.reduce((acc, current) => {
      const category = current.category || 'Chưa phân loại';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

    return { total, processing, completed, phuongData, categoryData };
  }, [records]);

  const COLORS = ['#ff3000', '#77011f', '#fced31', '#0ea5e9', '#10b981'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bảng điều khiển</h2>
          <p className="text-slate-500 font-medium">Theo dõi tình hình an sinh xã hội số</p>
        </div>
        <div className="flex items-center space-x-2 bg-brand-light px-4 py-2 rounded-2xl border border-brand-primary/10">
          <Clock size={18} className="text-brand-primary" />
          <span className="text-sm font-semibold text-brand-accent">Cập nhật: 11/05/2026</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng hồ sơ', value: stats.total, icon: Users, color: 'text-brand-accent', borderColor: 'border-brand-accent' },
          { label: 'Đang xử lý', value: stats.processing, icon: Activity, color: 'text-brand-secondary', borderColor: 'border-brand-secondary' },
          { label: 'Hoàn thành', value: stats.completed, icon: ShieldCheck, color: 'text-emerald-600', borderColor: 'border-emerald-500' },
          { label: 'Ngân sách hỗ trợ', value: '2.4B', icon: TrendingUp, color: 'text-brand-primary', borderColor: 'border-brand-primary' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn("glass-card p-6 border-l-4", item.borderColor)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thống kê</span>
              <item.icon size={18} className={item.color} />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-0.5">{item.value}</p>
            <p className="text-xs font-semibold text-slate-500">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Chart */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col space-y-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
                <Activity size={16} className="text-brand-primary" />
                Phân tích đối tượng hỗ trợ
            </h3>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotline 24/7</span>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={50}>
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Stats */}
        <div className="glass-card p-6 flex flex-col space-y-6">
          <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
            <MapPin size={16} className="text-brand-accent" />
            Thống kê theo địa bàn
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.phuongData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.phuongData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed bottom-8 right-8 bg-white shadow-2xl p-4 rounded-2xl border flex items-center gap-3 animate-bounce">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
            <span className="text-xs font-bold text-slate-600">Đang tải dữ liệu từ Google Sheets...</span>
        </div>
      )}

      {/* GIS Visual Mock */}
      <div className="glass-card p-6 space-y-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
            <MapPin size={16} className="text-brand-primary" />
            Bản đồ nhiệt mật độ hồ sơ (GIS)
          </h3>
          <button className="text-xs font-bold text-brand-primary">
            Phường Phương Lâm & Hòa Bình
          </button>
        </div>
        
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/105.3377,20.8172,12,0/800x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAwMHozN282Y3ZmM3FieW0ifQ.F6O-pUvI96YPr9Vxi9v96w')] bg-cover bg-center transition-transform duration-[20s] group-hover:scale-110" />
            
            {/* Heatmap/Pin Layers */}
            <div className="absolute inset-0 p-8">
                {records.map((record, i) => (
                    <motion.div
                        key={record.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="absolute cursor-pointer group/pin"
                        style={{ 
                            top: `${(record.lat! - 20.81) * 2000 + 40}%`, 
                            left: `${(record.lng! - 105.32) * 1500 + 30}%` 
                        }}
                    >
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-12 h-12 bg-rose-500/20 rounded-full animate-ping" />
                            <div className="relative w-4 h-4 bg-rose-600 rounded-full border-2 border-white shadow-lg" />
                            
                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover/pin:opacity-100 transition-opacity bg-white p-3 rounded-xl shadow-xl border w-48 pointer-events-none z-10">
                                <p className="text-xs font-bold truncate">{record.fullName}</p>
                                <p className="text-[10px] text-slate-500 mb-1">{record.oldAddress}</p>
                                <div className="flex items-center justify-between text-[9px] font-bold">
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{record.resolutionStatus}</span>
                                    <span className="text-brand-primary">{record.category}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border shadow-lg space-y-2">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Chú giải vùng</p>
                {stats.phuongData.map((p, i) => (
                    <div key={p.name} className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span>{p.name}: {p.value} hồ sơ</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
