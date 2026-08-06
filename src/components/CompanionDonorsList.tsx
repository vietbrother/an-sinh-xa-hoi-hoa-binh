import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Heart, Eye, X, Award, ExternalLink, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

interface DonorItem {
  id: string;
  name: string;
  amount: number;
  giftCount: number;
  date: string;
  description: string;
  imageUrl: string;
}

const MOCK_DONORS: DonorItem[] = [
  {
    id: '1',
    name: 'Hội Chữ thập đỏ Tỉnh Hòa Bình',
    amount: 1500000,
    giftCount: 50,
    date: '19/12/2024',
    description: 'Chương trình trao quà an sinh xã hội, phát huy vai trò nòng cốt trong sự nghiệp nhân đạo tỉnh Hòa Bình.',
    imageUrl: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/24/12/19/hoi-chu-thap-do-tinh-hoa-binh--phat-huy-vai-tro-nong-cot-trong-su-nghiep-nhan-dao--an-sinh-xa-hoi_67639b3857aca.jpg?md5=wLVFo_qBp0qBUjtzY47ijw&expires=1785526674'
  },
  {
    id: '2',
    name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)',
    amount: 800000,
    giftCount: 30,
    date: '15/12/2024',
    description: 'Hỗ trợ các hộ gia đình chính sách và hộ cận nghèo nhân dịp Tết Ất Tỵ.',
    imageUrl: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/24/12/19/hoi-chu-thap-do-tinh-hoa-binh--phat-huy-vai-tro-nong-cot-trong-su-nghiep-nhan-dao--an-sinh-xa-hoi_67639b3857aca.jpg?md5=wLVFo_qBp0qBUjtzY47ijw&expires=1785526674'
  },
  {
    id: '3',
    name: 'Tập đoàn Dầu khí Quốc gia Việt Nam (PVN)',
    amount: 2000000,
    giftCount: 80,
    date: '10/12/2024',
    description: 'Chương trình "Tết yêu thương" hỗ trợ đồng bào khó khăn vùng cao Hòa Bình.',
    imageUrl: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/24/12/19/hoi-chu-thap-do-tinh-hoa-binh--phat-huy-vai-tro-nong-cot-trong-su-nghiep-nhan-dao--an-sinh-xa-hoi_67639b3857aca.jpg?md5=wLVFo_qBp0qBUjtzY47ijw&expires=1785526674'
  },
  {
    id: '4',
    name: 'Công ty Cổ phần Thủy điện Hòa Bình',
    amount: 1000000,
    giftCount: 40,
    date: '05/12/2024',
    description: 'Hỗ trợ an sinh xã hội cho các hộ nghèo và gia đình chính sách trên địa bàn thành phố.',
    imageUrl: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/24/12/19/hoi-chu-thap-do-tinh-hoa-binh--phat-huy-vai-tro-nong-cot-trong-su-nghiep-nhan-dao--an-sinh-xa-hoi_67639b3857aca.jpg?md5=wLVFo_qBp0qBUjtzY47ijw&expires=1785526674'
  },
  {
    id: '5',
    name: 'Quỹ Thiện Tâm - Tập đoàn Vingroup',
    amount: 2500000,
    giftCount: 100,
    date: '01/12/2024',
    description: 'Chương trình quà tặng nhân đạo năm 2024.',
    imageUrl: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/24/12/19/hoi-chu-thap-do-tinh-hoa-binh--phat-huy-vai-tro-nong-cot-trong-su-nghiep-nhan-dao--an-sinh-xa-hoi_67639b3857aca.jpg?md5=wLVFo_qBp0qBUjtzY47ijw&expires=1785526674'
  }
];

export default function CompanionDonorsList() {
  const [selectedDonor, setSelectedDonor] = useState<DonorItem | null>(null);

  const totalAmount = MOCK_DONORS.reduce((acc, curr) => acc + curr.amount, 0);
  const totalGifts = MOCK_DONORS.reduce((acc, curr) => acc + curr.giftCount, 0);

  return (
    <>
      <div className="glass-card p-6 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight text-slate-800">
            <Building2 size={16} className="text-brand-primary" />
            Đơn vị Đồng hành & Ủng hộ An sinh
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
            <Heart size={12} className="fill-emerald-600 text-emerald-600" />
            {MOCK_DONORS.length} đơn vị
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {MOCK_DONORS.map((donor, index) => {
              const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(donor.amount);
              return (
                <div 
                  key={donor.id} 
                  onClick={() => setSelectedDonor(donor)}
                  className="group bg-slate-50 hover:bg-brand-primary/5 border border-slate-100 hover:border-brand-primary/20 p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                      #{index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-brand-primary transition-colors">
                        {donor.name}
                      </p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Calendar size={11} />
                        <span>{donor.date}</span>
                        <span>•</span>
                        <span className="text-brand-accent font-semibold">{donor.giftCount} suất quà</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      <p className="text-xs font-black text-slate-900">{formattedAmount}</p>
                      <span className="text-[10px] text-brand-primary font-bold group-hover:underline inline-flex items-center gap-0.5">
                        <Eye size={10} /> Xem ảnh
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award size={18} className="text-brand-primary" />
              <span className="text-xs font-bold text-slate-700">Tổng nguồn lực vận động</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-brand-primary block">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">{totalGifts} suất quà an sinh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail / Photo Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Building2 size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-1">{selectedDonor.name}</h4>
                  <p className="text-[10px] text-slate-500">Chi tiết ủng hộ & Hình ảnh trao tặng</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDonor(null)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Số tiền ủng hộ</span>
                  <span className="text-sm font-black text-brand-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedDonor.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Quy mô hỗ trợ</span>
                  <span className="text-sm font-black text-slate-800">{selectedDonor.giftCount} suất quà</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nội dung chương trình</span>
                <p className="text-xs font-medium text-slate-700 leading-relaxed bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/10">
                  {selectedDonor.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hình ảnh trao tặng quà thực tế</span>
                  {/*<a 
                    href={selectedDonor.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1"
                  >
                    Mở ảnh gốc <ExternalLink size={10} />
                  </a>*/}
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 group relative">
                  <img 
                    src={selectedDonor.imageUrl} 
                    alt={selectedDonor.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 flex items-end p-4">
                    <p className="text-xs text-white font-medium">Cho đi là còn mãi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDonor(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
              >
                Đóng cửa sổ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
