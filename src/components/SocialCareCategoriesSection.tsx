import React, { useState } from 'react';
import {
  FileText,
  FolderOpen,
  Eye,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Heart,
  Gift,
  Users,
  Home,
  Medal,
  X,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import DriveDocumentViewer from './DriveDocumentViewer';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface CategoryCardData {
  id: string;
  title: string;
  category: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  cardBorder: string;
  url: string;
  isFolder: boolean;
  totalRecordsEstimate: string;
  agency: string;
  lastUpdated: string;
  description: string;
  highlights: string[];
}

export const SOCIAL_CARE_CATEGORIES: CategoryCardData[] = [
  {
    id: 'ho-ngheo',
    title: 'Danh sách Hộ nghèo',
    category: 'Đối tượng nghèo đa chiều',
    badge: 'Chuẩn nghèo 2022-2025',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Home,
    iconBg: 'bg-emerald-100/80',
    iconColor: 'text-emerald-700',
    cardBorder: 'hover:border-emerald-500',
    url: 'https://drive.google.com/file/d/1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb/view',
    isFolder: false,
    totalRecordsEstimate: '100% Phường/Xã',
    agency: 'Ban Vận động Vì Người nghèo MTTQ',
    lastUpdated: 'Tháng 02/2026',
    description: 'Danh sách tổng hợp các hộ gia đình thuộc diện hộ nghèo theo tiêu chí thu nhập và mức độ thiếu hụt dịch vụ xã hội cơ bản.',
    highlights: ['Trợ cấp hàng tháng', 'Thẻ BHYT miễn phí', 'Hỗ trợ tiền điện & học phí'],
  },
  {
    id: 'ho-can-ngheo',
    title: 'Danh sách Hộ cận nghèo',
    category: 'Đối tượng cận nghèo',
    badge: 'Hỗ trợ thoát nghèo',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Users,
    iconBg: 'bg-amber-100/80',
    iconColor: 'text-amber-700',
    cardBorder: 'hover:border-amber-500',
    url: 'https://drive.google.com/file/d/1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb/view',
    isFolder: false,
    totalRecordsEstimate: 'Rà soát định kỳ',
    agency: 'UBND & MTTQ cấp cơ sở',
    lastUpdated: 'Tháng 02/2026',
    description: 'Danh sách các hộ gia đình có mức sống sát chuẩn nghèo, có nguy cơ tái nghèo khi gặp biến cố kinh tế hoặc y tế.',
    highlights: ['Hỗ trợ 70% mức đóng BHYT', 'Vay vốn ưu đãi SXKD', 'Tặng sinh kế giảm nghèo'],
  },
  {
    id: 'chinh-sach',
    title: 'Danh sách Hộ gia đình chính sách',
    category: 'Người có công với cách mạng',
    badge: 'Đền ơn đáp nghĩa',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: Medal,
    iconBg: 'bg-rose-100/80',
    iconColor: 'text-rose-700',
    cardBorder: 'hover:border-rose-500',
    url: 'https://drive.google.com/drive/folders/16snkJ-4uX4k0zUPG54n2YXsYKIDnWwF6?usp=drive_link',
    isFolder: true,
    totalRecordsEstimate: 'Thư mục số hóa',
    agency: 'Phòng Lao động - TB&XH & MTTQ',
    lastUpdated: 'Tháng 03/2026',
    description: 'Hồ sơ thương binh, bệnh binh, thân nhân liệt sĩ, người hoạt động kháng chiến và gia đình có công với đất nước.',
    highlights: ['Trợ cấp ưu đãi hàng tháng', 'Xây sửa Nhà tình nghĩa', 'Thăm hỏi lễ tết & điều dưỡng'],
  },
  {
    id: 'bao-tro-xh',
    title: 'Danh sách Bảo trợ xã hội',
    category: 'Đối tượng yếu thế xã hội',
    badge: 'Trợ cấp thường xuyên',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: ShieldCheck,
    iconBg: 'bg-blue-100/80',
    iconColor: 'text-blue-700',
    cardBorder: 'hover:border-blue-500',
    url: 'https://drive.google.com/drive/folders/1km49MdnRfnGUTIZsQRSfvvR5unUpXMBy?usp=drive_link',
    isFolder: true,
    totalRecordsEstimate: 'Thư mục số hóa',
    agency: 'Hội đồng Xác định Mức độ Khuyết tật',
    lastUpdated: 'Tháng 03/2026',
    description: 'Đối tượng bảo trợ gồm người khuyết tật nặng, người cao tuổi neo đơn, trẻ em mồ côi và người mắc bệnh hiểm nghèo.',
    highlights: ['Chi trả trợ cấp qua tài khoản', 'Cấp thẻ BHYT an sinh', 'Chăm sóc tại cộng đồng'],
  },
  {
    id: 'tang-qua',
    title: 'Danh sách Tặng quà an sinh',
    category: 'Minh bạch nguồn lực xã hội',
    badge: 'Nguồn lực vận động',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Gift,
    iconBg: 'bg-purple-100/80',
    iconColor: 'text-purple-700',
    cardBorder: 'hover:border-purple-500',
    url: 'https://drive.google.com/drive/folders/1CAyhZKSYJnGFWZdgZcxfcu9IpY7SXHOf?usp=drive_link',
    isFolder: true,
    totalRecordsEstimate: 'Thư mục số hóa',
    agency: 'Ban Cứu trợ & Vận động MTTQ',
    lastUpdated: 'Tháng 04/2026',
    description: 'Báo cáo chi tiết danh mục phân bổ các suất quà Tết, tiền mặt và hiện vật cứu trợ từ các nhà hảo tâm đến tận tay người dân.',
    highlights: ['Trao tận tay người thụ hưởng', 'Công khai danh sách tài trợ', 'Biên bản bàn giao minh bạch'],
  },
];

export default function SocialCareCategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryCardData | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'file' | 'folder'>('all');

  const filteredCategories = SOCIAL_CARE_CATEGORIES.filter((item) => {
    if (activeFilter === 'file') return !item.isFolder;
    if (activeFilter === 'folder') return item.isFolder;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            Hồ sơ & Danh sách An sinh Xã hội
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Tài liệu & Danh sách Quản lý Số hóa
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
            Tất cả các danh sách hộ nghèo, cận nghèo, gia đình chính sách, bảo trợ xã hội và quà tặng đều được lưu trữ trực tuyến an toàn và hỗ trợ xem nhúng trực tiếp ngay trên trang.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 self-start md:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              'px-3 py-1.5 text-xs font-bold rounded-xl transition-all',
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Tất cả (5)
          </button>
          <button
            onClick={() => setActiveFilter('file')}
            className={cn(
              'px-3 py-1.5 text-xs font-bold rounded-xl transition-all',
              activeFilter === 'file'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            File PDF (2)
          </button>
          <button
            onClick={() => setActiveFilter('folder')}
            className={cn(
              'px-3 py-1.5 text-xs font-bold rounded-xl transition-all',
              activeFilter === 'folder'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Thư mục Drive (3)
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'group glass-card p-5 md:p-6 flex flex-col justify-between border-2 border-slate-200/80 rounded-3xl transition-all duration-300 hover:shadow-xl relative overflow-hidden bg-white',
                item.cardBorder
              )}
            >
              {/* Background Accent Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-110 duration-300',
                      item.iconBg,
                      item.iconColor
                    )}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-black uppercase px-2.5 py-1 rounded-full border tracking-wider',
                      item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    {item.category}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2.5 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      • {h}
                    </span>
                  ))}
                </div>

                {/* Meta info */}
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Đơn vị quản lý:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[170px]">
                      {item.agency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Định dạng xem:</span>
                    <span className="font-bold text-brand-primary flex items-center gap-1">
                      {item.isFolder ? <FolderOpen size={12} /> : <FileText size={12} />}
                      {item.isFolder ? 'Thư mục tài liệu' : 'File PDF nhúng'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2 relative z-10">
                <button
                  onClick={() => setSelectedCategory(item)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs shadow-md shadow-brand-primary/20 flex items-center justify-center gap-1.5 transition-all group-hover:gap-2"
                >
                  <Eye size={15} />
                  <span>Xem danh sách</span>
                  <ArrowRight size={13} className="opacity-70" />
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Mở trên tab Google Drive mới"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Embedded Document Viewer Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden bg-white shadow-2xl relative"
            >
              {/* Modal Top Close Bar */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-all shadow-lg hover:scale-105"
                  aria-label="Đóng cửa sổ xem"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Injected Drive Document Viewer */}
              <DriveDocumentViewer
                title={selectedCategory.title}
                category={selectedCategory.category}
                url={selectedCategory.url}
                description={selectedCategory.description}
                className="border-0 rounded-none shadow-none flex-1"
                initialMode={selectedCategory.isFolder ? 'files' : 'embed'}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
