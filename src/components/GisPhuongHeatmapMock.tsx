import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Layers } from 'lucide-react';
import { SocialRecord } from '../types';

interface GisPhuongHeatmapMockProps {
  records: SocialRecord[];
  phuongData: Array<{ name: string; value: number }>;
}

const PHUONG_POSITIONS: Record<string, { top: string; left: string }> = {
  "Phường Phương Lâm": { top: '35%', left: '42%' },
  "Phường Thịnh Lang": { top: '25%', left: '65%' },
  "Phường Thịnh Lang cũ": { top: '22%', left: '62%' },
  "Phường Hòa Bình": { top: '55%', left: '50%' },
  "Phường Hoà Bình": { top: '55%', left: '50%' },
  "Phường Đồng Tiến": { top: '65%', left: '70%' },
  "Phường Tân Thịnh": { top: '20%', left: '30%' },
  "Phường Hữu Nghị": { top: '45%', left: '25%' },
  "Phường Hữu Nghị cũ": { top: '42%', left: '22%' },
  "Phường Trung Minh cũ": { top: '30%', left: '55%' },
  "Phường Thống Nhất": { top: '70%', left: '35%' },
  "Phường Khác": { top: '50%', left: '80%' }
};

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

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

  // Nếu địa bàn có 2 chữ "phường" hoặc có chữ "cũ", ưu tiên bóc tách theo tên phường cũ (có chữ "cũ")
  const oldWardMatch = address.match(/phường\s+([^,]+?)\s+cũ/i);
  if (oldWardMatch) {
    const rawWard = oldWardMatch[1].trim();
    const normalized = normalizeWardName(rawWard);
    return `Phường ${normalized} cũ`;
  }

  // Trường hợp chỉ có 1 chữ phường bình thường
  const normalWardMatch = address.match(/phường\s+([^,]+)/i);
  if (normalWardMatch) {
    const rawWard = normalWardMatch[1].replace(/cũ/gi, '').trim();
    const normalized = normalizeWardName(rawWard);
    return `Phường ${normalized}`;
  }

  return "Phường Khác";
}

export default function GisPhuongHeatmapMock({ records, phuongData }: GisPhuongHeatmapMockProps) {
  // Group records by extracted ward name according to rules
  const groupedWardData = React.useMemo(() => {
    const map: Record<string, SocialRecord[]> = {};
    records.forEach(r => {
      const wardName = extractWardName(r.oldAddress || '');
      if (!map[wardName]) map[wardName] = [];
      map[wardName].push(r);
    });

    return Object.entries(map).map(([name, recs]) => ({
      name,
      value: recs.length,
      records: recs
    })).sort((a, b) => b.value - a.value);
  }, [records]);

  return (
    <div className="lg:col-span-2 glass-card p-6 space-y-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
          <Layers size={16} className="text-brand-accent" />
          Bản đồ nhiệt mật độ theo Phường (GIS Heatmap Phường)
        </h3>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Tổng số: {groupedWardData.length} nhóm phường/địa bàn
        </span>
      </div>

      <div className="relative aspect-[16/9] md:aspect-[21/9] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/105.3377,20.8172,12,0/800x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAwMHozN282Y3ZmM3FieW0ifQ.F6O-pUvI96YPr9Vxi9v96w')] bg-cover bg-center transition-transform duration-[20s] group-hover:scale-110" />

        {/* Heatmap/Ward Marker Layers (Grouped by Ward) */}
        <div className="absolute inset-0 p-8">
          {groupedWardData.map((item, i) => {
            const pos = PHUONG_POSITIONS[item.name] || { 
              top: `${25 + (i * 12) % 55}%`, 
              left: `${20 + (i * 18) % 65}%` 
            };
            const wardRecords = item.records;
            const color = COLORS[i % COLORS.length];

            return (
              <motion.div
                key={item.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className="absolute cursor-pointer group/ward -translate-x-1/2 -translate-y-1/2"
                style={{ top: pos.top, left: pos.left }}
              >
                <div className="relative flex items-center justify-center">
                  {/* Ping animation with slower duration (4s) to avoid eye strain */}
                  <div 
                    className="absolute rounded-full opacity-25 pointer-events-none" 
                    style={{ 
                      width: `${Math.max(45, item.value * 6)}px`, 
                      height: `${Math.max(45, item.value * 6)}px`, 
                      backgroundColor: color,
                      animation: 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite'
                    }} 
                  />
                  
                  {/* Ward Marker Badge */}
                  <div 
                    className="relative px-3.5 py-1.5 rounded-full text-white font-black text-xs shadow-xl border-2 border-white flex items-center gap-1.5 transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                  >
                    <MapPin size={12} />
                    <span>{item.name}</span>
                    <span className="bg-black/20 px-1.5 py-0.5 rounded-full text-[10px]">{item.value}</span>
                  </div>

                  {/* Hover Tooltip showing ward details */}
                  <div className="absolute bottom-full mb-3 opacity-0 group-hover/ward:opacity-100 transition-opacity bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 w-64 pointer-events-none z-20">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                      <span className="text-xs font-black text-slate-800">{item.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.value} hồ sơ
                      </span>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {wardRecords.slice(0, 5).map((rec) => (
                        <div key={rec.id} className="text-[11px] flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                          <span className="font-medium text-slate-700 truncate max-w-[130px]">{rec.fullName}</span>
                          <span className="text-[10px] text-brand-primary font-semibold">{rec.resolutionStatus}</span>
                        </div>
                      ))}
                      {wardRecords.length > 5 && (
                        <p className="text-[10px] text-slate-400 text-center italic pt-1">
                          Và {wardRecords.length - 5} hồ sơ khác...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border shadow-lg space-y-2 max-h-48 overflow-y-auto">
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Mật độ theo Phường</p>
          {groupedWardData.map((p, i) => (
            <div key={p.name} className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="truncate max-w-[180px]">{p.name}: {p.value} hồ sơ</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
