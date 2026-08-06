import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { RecordItem } from '../RecordContext';

interface GisVisualMapCardProps {
  records: RecordItem[];
  phuongData: { name: string; value: number }[];
  colors: string[];
}

export default function GisVisualMapCard({ records, phuongData, colors }: GisVisualMapCardProps) {
  return (
    <div className="glass-card p-6 space-y-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight text-slate-800">
          <MapPin size={16} className="text-brand-primary" />
          Bản đồ nhiệt mật độ hồ sơ (GIS)
        </h3>
        <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
          Phường Phương Lâm & Hòa Bình
        </span>
      </div>

      <div className="relative flex-1 min-h-[340px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group flex items-center justify-center">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-45 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/105.3377,20.8172,12,0/800x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAwMHozN282Y3ZmM3FieW0ifQ.F6O-pUvI96YPr9Vxi9v96w')] bg-cover bg-center transition-transform duration-[20s] group-hover:scale-105" />

        {/* Heatmap/Pin Layers */}
        <div className="absolute inset-0 p-8">
          {records.map((record, i) => (
            <motion.div
              key={record.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className="absolute cursor-pointer group/pin"
              style={{
                top: `${(record.lat! - 20.81) * 2000 + 40}%`,
                left: `${(record.lng! - 105.32) * 1500 + 30}%`
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-10 h-10 bg-rose-500/25 rounded-full animate-ping" />
                <div className="relative w-3.5 h-3.5 bg-rose-600 rounded-full border-2 border-white shadow-md" />

                {/* Hover Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover/pin:opacity-100 transition-opacity bg-white p-3 rounded-xl shadow-2xl border border-slate-100 w-48 pointer-events-none z-20">
                  <p className="text-xs font-bold truncate text-slate-900">{record.headOfHousehold || record.category}</p>
                  <p className="text-[10px] text-slate-500 mb-1.5 truncate">{record.oldAddress}</p>
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
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 shadow-xl space-y-1.5 max-w-[220px]">
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Chú giải vùng</p>
          <div className="max-h-28 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {phuongData.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-xs font-bold text-slate-700 gap-2">
                <div className="flex items-center space-x-1.5 truncate">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                  <span className="truncate">{p.name}</span>
                </div>
                <span className="text-[10px] text-brand-primary font-black">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
