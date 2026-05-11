import React, { useState, useMemo } from 'react';
import { MOCK_RECORDS } from '../data/mockData';
import { useAuth } from '../AuthContext';
import { useRecords } from '../RecordContext';
import { SocialRecord } from '../types';
import { 
  Search, Filter, ChevronRight, MapPin, 
  Phone, User as UserIcon, Calendar, CheckCircle2, 
  AlertCircle, Clock, ExternalLink, MoreVertical,
  Plus, ArrowRight, ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const YOUR_GAS_URL = 'https://script.google.com/macros/s/AKfycbwfgh49fKlrKTtziHMr9BvH4iLG-eU-ejLEELc88bSDCfR8SvSA56g4sw-0m4-pX6w/exec?token=AnSinhXaHoi@2026';
export default function RecordsList() {
  const { user } = useAuth();
  const { records, isLoading, refreshRecords } = useRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<SocialRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Processing Form State
  const [processingData, setProcessingData] = useState({
    tinhTrang: '',
    ketQua: '',
    lichSu: ''
  });

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = 
        record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.oldAddress.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || record.resolutionStatus === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus, records]);

  const handleProcess = async () => {
    if (!selectedRecord) return;
    setIsUpdating(true);
    
    // Payload for Google App Script
    const payload = {
      id: selectedRecord.id,
      lichSuHoTro: processingData.lichSu,
      canBo: user?.fullName || 'N/A',
      tinhTrang: processingData.tinhTrang,
      ketQua: processingData.ketQua
    };

    try {
      console.log('Sending to Google App Script:', payload);
      
      // Simulated API Call
      //await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would normally call your Google App Script POST endpoint
      const res = await fetch(YOUR_GAS_URL, { method: 'POST', body: JSON.stringify(payload) });
      
      alert(`Đã cập nhật hồ sơ ${selectedRecord.id} thành công! Hệ thống sẽ tự động đồng bộ lại dữ liệu.`);
      await refreshRecords();
    } catch (err) {
      alert('Lỗi cập nhật hồ sơ. Vui lòng thử lại.');
    } finally {
      setIsUpdating(false);
      setSelectedRecord(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Đang xử lý': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Kiểm tra hồ sơ': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Trả kết quả': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Danh sách hồ sơ</h2>
          <p className="text-slate-500 font-medium">Quản lý và theo dõi tiến độ giải quyết</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative group flex-1 md:w-64">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary" />
                <input 
                    type="text"
                    placeholder="Tìm kiếm hồ sơ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all shadow-sm"
                />
            </div>
            <div className="relative">
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary shadow-sm font-medium text-slate-600"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Kiểm tra hồ sơ">Kiểm tra hồ sơ</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Trả kết quả">Trả kết quả</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                </select>
                <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
        </div>
      </div>

      {/* Records Grid */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#f9fafb] border-b border-brand-border">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã hồ sơ</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Chủ hộ / Đối tượng</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Địa bàn</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phân loại</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-4 text-xs font-black text-slate-400 group-hover:text-brand-primary transition-colors">{record.id}</td>
                            <td className="px-6 py-4">
                                <p className="text-sm font-bold text-slate-900 leading-none mb-1">{record.fullName}</p>
                                <p className="text-[11px] text-slate-500">{record.phone}</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-xs font-medium text-slate-600">{record.oldAddress}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    {record.category}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={cn("badge", 
                                    record.resolutionStatus === 'Hoàn thành' ? "badge-complete" :
                                    record.resolutionStatus === 'Đang xử lý' ? "badge-processing" : "badge-urgent"
                                )}>
                                    {record.resolutionStatus}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => {
                                        setSelectedRecord(record);
                                        setProcessingData({
                                            tinhTrang: record.resolutionStatus,
                                            ketQua: record.result,
                                            lichSu: record.supportHistory
                                        });
                                    }}
                                    className="bg-brand-accent text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-tight hover:brightness-110 active:scale-95 transition-all"
                                >
                                    {user?.role === 'CITIZEN' ? 'Xem' : 'Xử lý'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {filteredRecords.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-lg font-bold text-slate-900">Không tìm thấy hồ sơ nào</h3>
          </div>
        )}
      </div>

      {/* Processing/Details Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh] border border-brand-border"
            >
              {/* Modal Header */}
              <div className="brand-gradient p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full border border-white/20">Chi tiết hồ sơ</span>
                    <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>
                <h3 className="text-3xl font-black mb-2">{selectedRecord.fullName}</h3>
                <div className="flex items-center gap-4 text-sm font-medium text-white/80">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-brand-secondary" /> {selectedRecord.oldAddress}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span>{selectedRecord.id}</span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <section>
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 block">Phân loại & Đối tượng</label>
                            <p className="text-sm font-bold text-brand-primary bg-brand-primary/5 px-4 py-2 rounded-xl inline-block border border-brand-primary/10">
                                {selectedRecord.col4}
                            </p>
                        </section>
                        <section>
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 block">Họ và tên chủ hộ</label>
                            <p className="text-slate-900 font-bold">{selectedRecord.headOfHousehold || "N/A"}</p>
                        </section>
                        <section>
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 block">Hoàn cảnh gia đình</label>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl italic border">{selectedRecord.familyCircumstance}</p>
                        </section>
                    </div>

                    <div className="space-y-4">
                        <section>
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 block">Nhu cầu hỗ trợ</label>
                            <p className="text-slate-900 font-bold flex items-start gap-2">
                                <AlertCircle size={18} className="text-brand-primary mt-0.5 shrink-0" />
                                {selectedRecord.supportNeed || "N/A"}
                            </p>
                        </section>
                         <section>
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 block">Hộ khẩu thường trú</label>
                            <p className="text-sm text-slate-700 font-medium">{selectedRecord.residentAddress || "N/A"}</p>
                        </section>
                    </div>
                </div>

                {/* Processing Section (Officer/Admin Only) */}
                {user?.role !== 'CITIZEN' && (
                    <div className="pt-8 border-t space-y-6">
                        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <ClipboardCheck size={24} className="text-emerald-500" />
                            Xử lý & Cập nhật kết quả
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tình trạng hồ sơ</label>
                                <select 
                                    value={processingData.tinhTrang}
                                    onChange={(e) => setProcessingData({ ...processingData, tinhTrang: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary font-bold text-slate-700"
                                >
                                    <option value="Kiểm tra hồ sơ">Kiểm tra hồ sơ</option>
                                    <option value="Phối hợp xử lý lại đơn vị">Phối hợp xử lý lại đơn vị</option>
                                    <option value="Đang xử lý">Đang xử lý</option>
                                    <option value="Hoàn thành">Hoàn thành</option>
                                    <option value="Trả kết quả">Trả kết quả</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Kết quả hỗ trợ</label>
                                <input 
                                    type="text"
                                    value={processingData.ketQua}
                                    onChange={(e) => setProcessingData({ ...processingData, ketQua: e.target.value })}
                                    placeholder="VD: Đã tiếp nhận, Đã tặng quà..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary font-bold text-slate-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Lịch sử hỗ trợ / Ghi chú xử lý</label>
                            <textarea 
                                rows={3}
                                value={processingData.lichSu}
                                onChange={(e) => setProcessingData({ ...processingData, lichSu: e.target.value })}
                                placeholder="Nhập ghi chú chi tiết về các bước đã thực hiện..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-700 font-medium leading-relaxed"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={() => setSelectedRecord(null)}
                                className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={handleProcess}
                                disabled={isUpdating}
                                className={cn(
                                    "flex-[2] brand-gradient text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70",
                                    isUpdating && "animate-pulse"
                                )}
                            >
                                {isUpdating ? (
                                    <>Đang đồng bộ Sheets...</>
                                ) : (
                                    <>
                                        <CheckCircle2 size={20} />
                                        Cập nhật & Hoàn tất
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="fixed bottom-8 right-8 bg-white shadow-2xl p-4 rounded-2xl border flex items-center gap-3 animate-bounce">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
            <span className="text-xs font-bold text-slate-600">Đang tải dữ liệu từ Google Sheets...</span>
        </div>
      )}
    </div>
  );
}
