import React, { useMemo } from 'react';
import { useRecords } from '../RecordContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Users, Clock, MapPin,
  TrendingUp, Activity, ShieldCheck, Timer,
  Heart, Handshake, ClipboardList, FileText, PhoneCall
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { parse, differenceInMinutes } from 'date-fns';
import GisPhuongHeatmapMock from '../components/GisPhuongHeatmapMock';
import CompanionDonorsList from '../components/CompanionDonorsList';
import RegionalStatsCard from '../components/RegionalStatsCard';
import GisVisualMapCard from '../components/GisVisualMapCard';

function normalizeWardName(name: string): string {
  let clean = name.trim();
  const lower = clean.toLowerCase();
  if (lower.includes("hòa bình") || lower.includes("hoà bình")) {
    return "Hòa Bình";
  }
  if (lower.includes("trung minh")) {
    return "Trung Minh";
  }
  if (lower.includes("hữu nghị")) {
    return "Hữu Nghị";
  }
  if (lower.includes("thịnh lang")) {
    return "Thịnh Lang";
  }
  if (lower.includes("phương lâm")) {
    return "Phương Lâm";
  }
  if (lower.includes("tân thịnh")) {
    return "Tân Thịnh";
  }
  if (lower.includes("thống nhất")) {
    return "Thống Nhất";
  }
  return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function extractWardName(address: string): string {
  if (!address) return "Phường Khác";

  const oldWardMatch = address.match(/phường\s+([^,]+?)\s+cũ/i);
  if (oldWardMatch) {
    const rawWard = oldWardMatch[1].trim();
    const normalized = normalizeWardName(rawWard);
    return `Phường ${normalized} cũ`;
  }

  const normalWardMatch = address.match(/phường\s+([^,]+)/i);
  if (normalWardMatch) {
    const rawWard = normalWardMatch[1].replace(/cũ/gi, '').trim();
    const normalized = normalizeWardName(rawWard);
    return `Phường ${normalized}`;
  }

  return "Phường Khác";
}

export default function Dashboard() {
  const { records, isLoading } = useRecords();

  const stats = useMemo(() => {
    const total = records.length;
    const processing = records.filter(r => r.resolutionStatus === 'Đang xử lý').length;
    const completedRecords = records.filter(r => r.resolutionStatus === 'Hoàn thành');
    const completed = completedRecords.length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate Average Completion Time
    let totalMinutes = 0;
    let validCompletedCount = 0;

    completedRecords.forEach(r => {
      if (r.timestamp && r.completionTime) {
        try {
          // Standard Google Sheets format: DD/MM/YYYY HH:mm:ss
          const start = parse(r.timestamp, 'dd/MM/yyyy HH:mm:ss', new Date());

          // Completion time might be YYYY-MM-DD or DD/MM/YYYY
          let end;
          if (r.completionTime.includes('-')) {
            end = parse(r.completionTime, 'yyyy-MM-dd HH:mm:ss', new Date());
          } else {
            end = parse(r.completionTime, 'dd/MM/yyyy HH:mm:ss', new Date());
          }

          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            const diff = differenceInMinutes(end, start);
            if (diff > 0) {
              totalMinutes += diff;
              validCompletedCount++;
            }
          }
        } catch (e) {
          console.warn("Date parsing error for record", r.id, e);
        }
      }
    });

    const avgMinutes = validCompletedCount > 0 ? totalMinutes / validCompletedCount : 0;
    const avgHours = (avgMinutes / 60).toFixed(1);

    // Stats by Phuong
    const phuongStats = records.reduce((acc, current) => {
      const wardName = extractWardName(current.oldAddress || current.phuong || '');
      acc[wardName] = (acc[wardName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const phuongData = Object.entries(phuongStats).map(([name, value]) => ({ name, value: Number(value) })).sort((a, b) => b.value - a.value);

    // Stats by Type (Category)
    const categoryStats = records.reduce((acc, current) => {
      const category = current.category || 'Chưa phân loại';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

    // Stats by updatedSupportStatus (Tình trạng hỗ trợ mới)
    const updatedStatusStats = records.reduce((acc, current) => {
      const status = current.updatedSupportStatus || 'Chưa cập nhật';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const updatedStatusData = Object.entries(updatedStatusStats)
      .filter(([name]) => name.trim() !== '')
      .map(([name, value]) => ({ name, value }));

    // Stats by supportType (Hình thức hỗ trợ)
    const supportTypeStats = records.reduce((acc, current) => {
      const type = current.supportType || 'Chưa phân loại';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const supportTypeData = Object.entries(supportTypeStats)
      .filter(([name]) => name.trim() !== '')
      .map(([name, value]) => ({ name, value }));

    // Stats by Coordinating Unit
    const coordinatingStats = records.reduce((acc, current) => {
      const unit = current.coordinatingUnit || 'Hệ thống trực tiếp';
      acc[unit] = (acc[unit] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const coordinatingData = Object.entries(coordinatingStats)
      .filter(([name]) => name.trim() !== '')
      .map(([name, value]) => ({ name, value }));

    // Count of records with phone contact
    const hasContactPhoneCount = records.filter(r => r.contactPhone && r.contactPhone.trim() !== '').length;

    // Recent support notifications / activity from newly added columns
    const recentActivities = [...records]
      .filter(r => r.supportHistoryNew || r.result || r.processingOfficer)
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        fullName: r.fullName,
        officer: r.processingOfficer || 'Cán bộ',
        history: r.supportHistoryNew || r.result || 'Cập nhật thông tin hỗ trợ',
        status: r.updatedSupportStatus || 'Đã tiếp nhận',
        unit: r.coordinatingUnit || 'Trực tiếp',
        time: r.completionTime || 'Mới cập nhật'
      }));

    const completionPieData = [
      { name: 'Hoàn thành', value: completed },
      { name: 'Chưa hoàn thành', value: total - completed }
    ];

    return { 
      total, 
      processing, 
      completed, 
      phuongData, 
      categoryData, 
      completionRate, 
      avgHours, 
      completionPieData,
      updatedStatusData,
      supportTypeData,
      coordinatingData,
      hasContactPhoneCount,
      recentActivities
    };
  }, [records]);

  const COLORS = ['#ff3000', '#77011f', '#fced31', '#0ea5e9', '#10b981'];
  const COMPLETION_COLORS = ['#10b981', '#f1f5f9'];
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bảng điều khiển</h2>
          <p className="text-slate-500 font-medium">Theo dõi tình hình an sinh xã hội số</p>
        </div>
        <div className="flex items-center space-x-2 bg-brand-light px-4 py-2 rounded-2xl border border-brand-primary/10">
          <Clock size={18} className="text-brand-primary" />
          <span className="text-sm font-semibold text-brand-accent">Cập nhật: {currentDate}</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng hồ sơ', value: stats.total, icon: Users, color: 'text-brand-accent', borderColor: 'border-brand-accent' },
          { label: 'Tỷ lệ hoàn thành', value: `${stats.completionRate}%`, icon: ShieldCheck, color: 'text-emerald-600', borderColor: 'border-emerald-500' },
          { label: 'Thời gian xử lý TB', value: `${stats.avgHours}h`, icon: Timer, color: 'text-blue-600', borderColor: 'border-blue-500' },
          { label: 'Đang chờ xử lý', value: stats.processing, icon: Clock, color: 'text-brand-primary', borderColor: 'border-brand-primary' },
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
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
              className="text-2xl font-bold text-slate-900 mb-0.5"
            >
              {item.value}
            </motion.p>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trực tuyến</span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={50} animationDuration={1500}>
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Rate Chart */}
        <div className="glass-card p-6 flex flex-col space-y-6">
          <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
            <ShieldCheck size={16} className="text-emerald-500" />
            Tiến độ hoàn thành
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.completionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                  // Tăng tốc độ và hiệu ứng mượt hơn
                  animationBegin={500}
                  animationDuration={2500}
                  animationEasing="ease-out"
                  paddingAngle={0}
                  stroke="none"
                >
                  {stats.completionPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COMPLETION_COLORS[index % COMPLETION_COLORS.length]}
                      // Đảm bảo phần "Đã xong" luôn có hiệu ứng mượt
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  ))}
                </Pie>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-6">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl font-black text-slate-900"
              >
                {/* Check null/undefined cho rate */}
                {stats?.completionRate || 0}%
              </motion.span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Hoàn thành
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center border-t border-slate-100 pt-4">
            <div>
              <p className="text-lg font-bold text-emerald-600">
                {stats?.completed ?? 0}
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Đã xong</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-400">
                {(stats?.total ?? 0) - (stats?.completed ?? 0)}
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Còn lại</p>
            </div>
          </div>
        </div>


      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Regional Stats Component */}
        <RegionalStatsCard phuongData={stats.phuongData} />

        {/* GIS Visual Map Card Component */}
        <div className="lg:col-span-2">
          <GisVisualMapCard records={records} phuongData={stats.phuongData} colors={COLORS} />
        </div>
      </div>

      {/* New GIS Phuong Heatmap Mock Component */}
      <div className="grid grid-cols-1 gap-8">
        <GisPhuongHeatmapMock
          records={records}
          phuongData={stats.phuongData}
        />
      </div>

      {/* Companion Donors List Component */}
      <div className="grid grid-cols-1 gap-8">
        <CompanionDonorsList />
      </div>

      {/* Advanced metrics section from updated columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Support Statuses */}
        {/* 
        <div className="glass-card p-6 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
              <ClipboardList size={16} className="text-brand-primary" />
              Cập nhật Tình trạng Hỗ trợ
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
              Mới
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {stats.updatedStatusData.length === 0 ? (
              <p className="text-xs text-slate-400 text-center italic my-auto">Chưa có thông tin cập nhật hỗ trợ mới</p>
            ) : (
              <div className="space-y-3">
                {stats.updatedStatusData.map((item, index) => {
                  const percentage = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0;
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="truncate max-w-[150px]">{item.name}</span>
                        <span>{item.value} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PhoneCall size={16} className="text-brand-accent animate-bounce" />
                <span className="text-xs font-bold text-slate-600">Đã cập nhật SĐT liên hệ</span>
              </div>
              <span className="text-sm font-black text-slate-800">
                {stats.hasContactPhoneCount} / {stats.total}
              </span>
            </div>
          </div>
        </div>
        */}

        {/* Coordinating Units and Support Formats */}
        <div className="glass-card p-6 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
              <Handshake size={16} className="text-teal-600" />
              Sự tham gia của Đơn vị phối hợp
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
              Liên kết
            </span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[220px] space-y-2 pr-1">
            {stats.coordinatingData.length === 0 ? (
              <p className="text-xs text-slate-400 text-center italic my-auto">Chưa ghi nhận đơn vị phối hợp</p>
            ) : (
              stats.coordinatingData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-bold p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-slate-700 truncate max-w-[180px]">{item.name}</span>
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100 text-[10px]">
                    {item.value} lượt
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Support Log News */}
        <div className="glass-card p-6 flex flex-col space-y-6 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
              <Heart size={16} className="text-rose-600 animate-pulse" />
              Nhật ký hỗ trợ mới cập nhật
            </h3>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="flex-1 overflow-y-auto max-h-[220px] space-y-3 pr-1">
            {stats.recentActivities.length === 0 ? (
              <p className="text-xs text-slate-400 text-center italic my-auto">Chưa có hoạt động cập nhật</p>
            ) : (
              stats.recentActivities.map((act) => (
                <div key={act.id + act.fullName} className="text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-slate-800">{act.fullName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-black text-slate-500 truncate max-w-[100px]">
                      {act.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic line-clamp-2 mb-1">"{act.history}"</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span>CB: {act.officer}</span>
                    <span>{act.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed bottom-8 right-8 bg-white shadow-2xl p-4 rounded-2xl border flex items-center gap-3 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
          <span className="text-xs font-bold text-slate-600">Đang tải dữ liệu từ Google Sheets...</span>
        </div>
      )}
    </div>
  );
}
