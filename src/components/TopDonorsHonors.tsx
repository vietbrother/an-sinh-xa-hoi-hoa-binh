import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Heart,
  Eye,
  X,
  Award,
  Calendar,
  Trophy,
  Medal,
  Sparkles,
  Flame,
  CheckCircle2,
  Gift
} from 'lucide-react';
import FireworksBloom from './FireworksBloom';

export interface DonorItem {
  id: string;
  name: string;
  amount: number;
  giftCount: number;
  date: string;
  description: string;
  imageUrl: string;
  badge?: string;
}

export const DONOR_HONORS_DATA: DonorItem[] = [
  {
    id: '1',
    name: 'Bệnh viện đa khoa Hòa Bình',
    amount: 182045752,
    giftCount: 50,
    date: '19/04/2026',
    description: 'Chương trình trao quà an sinh xã hội, phát huy vai trò nòng cốt trong sự nghiệp nhân đạo tỉnh Hòa Bình.',
    imageUrl: 'https://drive.google.com/file/d/1bass3JULDU2Nb67ir_YWhGBgT78PMzdX/view',
    badge: 'Đơn vị Kim Cương'
  },
  {
    id: '2',
    name: 'Công ty xổ số kiến thiết Hòa Bình',
    amount: 111800000,
    giftCount: 30,
    date: '15/12/2025',
    description: 'Hỗ trợ các hộ gia đình chính sách và hộ cận nghèo nhân dịp Tết Ất Tỵ, chung tay vì cộng đồng.',
    imageUrl: 'https://drive.google.com/file/d/1tyt25r-7r1RnMReXbkAbUbmu39RF_u2w/view',
    badge: 'Đơn vị Vàng'
  },
  {
    id: '3',
    name: 'Tập đoàn Dầu khí Quốc gia Việt Nam (PVN)',
    amount: 2000000,
    giftCount: 80,
    date: '10/12/2024',
    description: 'Chương trình "Tết yêu thương" hỗ trợ đồng bào khó khăn vùng cao Hòa Bình ấm lòng mùa đông.',
    imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&q=80&w=600',
    badge: 'Đơn vị Bạc'
  },
  {
    id: '4',
    name: 'Công ty Cổ phần Thủy điện Hòa Bình',
    amount: 1000000,
    giftCount: 40,
    date: '05/12/2024',
    description: 'Hỗ trợ an sinh xã hội cho các hộ nghèo và gia đình chính sách trên địa bàn thành phố.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
    badge: 'Đơn vị Đồng hành'
  },
  {
    id: '5',
    name: 'Quỹ Thiện Tâm - Tập đoàn Vingroup',
    amount: 2500000,
    giftCount: 100,
    date: '01/12/2024',
    description: 'Chương trình quà tặng nhân đạo và hỗ trợ sinh kế bền vững cho các gia đình có hoàn cảnh đặc biệt.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
    badge: 'Đơn vị Đồng hành'
  }
];

export function getValidImageUrl(url: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&q=80&w=600';
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=s800`;
    }
  }
  return url;
}

export default function TopDonorsHonors() {
  const [selectedDonor, setSelectedDonor] = useState<DonorItem | null>(null);

  // Sort donors descending by amount
  const sortedDonors = [...DONOR_HONORS_DATA].sort((a, b) => b.amount - a.amount);
  const top1 = sortedDonors[0];
  const top2 = sortedDonors[1];
  const remainingDonors = sortedDonors.slice(2);

  const totalAmount = DONOR_HONORS_DATA.reduce((acc, curr) => acc + curr.amount, 0);
  const totalGifts = DONOR_HONORS_DATA.reduce((acc, curr) => acc + curr.giftCount, 0);

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-200 text-xs font-black uppercase tracking-wider mb-2">
            <Trophy size={14} className="text-amber-500 fill-amber-500" />
            Tấm Lòng Vàng Vì Cộng Đồng
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Đơn vị Đồng hành & Vinh danh Nhà tài trợ
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
            Tri ân sâu sắc những nghĩa cử cao đẹp, sự chung tay góp sức của các cơ quan, đơn vị, doanh nghiệp và nhà hảo tâm trong sự nghiệp an sinh xã hội địa phương.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-black">
            <Heart size={14} className="fill-emerald-600 text-emerald-600" />
            <span>{DONOR_HONORS_DATA.length} Đơn vị tiên phong</span>
          </div>
        </div>
      </div>

      {/* Top 1 & Top 2 Featured Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Top 1 Gold Honor Spotlight (7 cols on large screens) */}
        {top1 && (
          <div className="lg:col-span-7 relative group">
            <div
              onClick={() => setSelectedDonor(top1)}
              className="relative h-full bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-2 border-amber-400 hover:border-amber-500 rounded-3xl p-5 md:p-7 cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Fireworks Bloom Animation Layer for Top 1 */}
              <FireworksBloom active={true} />

              {/* Decorative Top 1 Crown Header Badge */}
              <div className="flex items-center justify-between relative z-10 mb-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                  <Trophy size={15} className="fill-white" />
                  <span>TOP 1 VÀNG • NHÀ TÀI TRỢ TIÊU BIỂU</span>
                </div>
                <span className="text-[11px] font-black uppercase text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-200">
                  {top1.badge}
                </span>
              </div>

              {/* Main Content & Picture */}
              <div className="space-y-4 relative z-10">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border-2 border-amber-300/60 shadow-inner group">
                  <img
                    src={getValidImageUrl(top1.imageUrl)}
                    alt={top1.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-5">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                      <Sparkles size={13} />
                      Đóng góp xuất sắc nhất cho quỹ An sinh
                    </span>
                    <h3 className="text-base md:text-lg font-black text-white leading-tight">
                      {top1.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-amber-200/60 shadow-sm">
                  {top1.description}
                </p>

                {/* Key Numbers Bar */}
                <div className="grid grid-cols-2 gap-3 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 p-4 rounded-2xl border border-amber-300/50">
                  <div>
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                      Tổng kinh phí tài trợ
                    </span>
                    <span className="text-lg md:text-xl font-black text-amber-700 block mt-0.5">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(top1.amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                      Số lượng quà tặng
                    </span>
                    <span className="text-lg md:text-xl font-black text-slate-900 block mt-0.5">
                      {top1.giftCount} suất quà an sinh
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Callout */}
              <div className="mt-5 pt-4 border-t border-amber-200/70 flex items-center justify-between text-xs text-amber-900 relative z-10">
                <span className="flex items-center gap-1.5 font-bold">
                  <Calendar size={14} className="text-amber-600" />
                  Ghi nhận: {top1.date}
                </span>
                <span className="font-extrabold text-amber-600 group-hover:underline flex items-center gap-1">
                  <Eye size={14} /> Xem ảnh trao tặng chi tiết
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Top 2 Silver Spotlight & Total Summary (5 cols on large screens) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          {/* Top 2 Card */}
          {top2 && (
            <div
              onClick={() => setSelectedDonor(top2)}
              className="group relative bg-gradient-to-br from-slate-100 via-white to-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-3xl p-5 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg flex flex-col justify-between overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700 text-white font-black text-xs uppercase tracking-wider shadow">
                  <Medal size={14} className="fill-white" />
                  <span>TOP 2 BẠC • ĐỒNG HÀNH XUẤT SẮC</span>
                </div>
                <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded">
                  {top2.badge}
                </span>
              </div>

              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-200">
                  <img
                    src={getValidImageUrl(top2.imageUrl)}
                    alt={top2.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3.5">
                    <span className="text-sm font-bold text-white line-clamp-1">{top2.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kinh phí tài trợ</span>
                    <span className="text-base font-black text-slate-800">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(top2.amount)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quy mô</span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {top2.giftCount} suất quà
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Total Summary Metric Banner */}
          <div className="bg-gradient-to-br from-brand-accent to-[#500010] text-white p-5 rounded-3xl shadow-lg border border-brand-primary/20 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-brand-secondary flex items-center gap-1.5">
                <Award size={16} /> Tổng Nguồn Lực Đã Vận Động
              </span>
              <span className="text-[10px] font-bold bg-white/10 px-2.5 py-0.5 rounded-full">Năm 2024 - 2026</span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div>
                <span className="text-xl md:text-2xl font-black text-brand-secondary block tracking-tight">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                </span>
                <span className="text-xs text-white/80 font-medium mt-0.5 block">
                  Đã giải ngân và trao tặng 100% đúng đối tượng
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-white block">{totalGifts}</span>
                <span className="text-[11px] text-white/70">Suất quà an sinh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Sponsors List */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Các đơn vị đồng hành và ủng hộ khác
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {remainingDonors.map((donor, idx) => (
            <div
              key={donor.id}
              onClick={() => setSelectedDonor(donor)}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-brand-primary/5 border border-slate-200/70 hover:border-brand-primary/30 transition-all cursor-pointer group flex flex-col justify-between gap-2.5"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary font-black text-xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  #{idx + 3}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-brand-primary transition-colors">
                    {donor.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Calendar size={10} /> {donor.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                <span className="font-black text-slate-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(donor.amount)}
                </span>
                <span className="text-[10px] font-bold text-brand-primary group-hover:underline flex items-center gap-1">
                  <Eye size={11} /> {donor.giftCount} quà
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Photo & Recognition Modal */}
      <AnimatePresence>
        {selectedDonor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-black text-slate-900 line-clamp-1">{selectedDonor.name}</h4>
                    <p className="text-[10px] text-slate-500">Vinh danh Đơn vị Đồng hành & Tài trợ An sinh</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDonor(null)}
                  className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kinh phí ủng hộ</span>
                    <span className="text-base font-black text-brand-primary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedDonor.amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Số lượng quà tặng</span>
                    <span className="text-base font-black text-slate-800">{selectedDonor.giftCount} suất quà</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nội dung chương trình</span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-brand-primary/5 p-3.5 rounded-2xl border border-brand-primary/10">
                    {selectedDonor.description}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Hình ảnh trao tặng thực tế</span>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 relative group">
                    <img
                      src={getValidImageUrl(selectedDonor.imageUrl)}
                      alt={selectedDonor.name}
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                      <p className="text-xs text-white font-medium flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        Minh bạch - Trực tiếp - Kịp thời
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDonor(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
