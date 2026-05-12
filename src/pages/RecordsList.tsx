import React, { useState, useMemo } from 'react';
import { MOCK_RECORDS } from '../data/mockData';
import { useAuth } from '../AuthContext';
import { useRecords } from '../RecordContext';
import { SocialRecord } from '../types';
import { 
  Search, Filter, ChevronRight, MapPin, 
  Phone, User as UserIcon, Calendar, CheckCircle2, 
  AlertCircle, Clock, ExternalLink, MoreVertical,
  Plus, ArrowRight, ClipboardCheck, TrendingUp, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const YOUR_GAS_URL = 'https://script.google.com/macros/s/AKfycbwG3ZoFcgASrfvvTmFyBInKnXW44dHHb_y-lhBMFn70oXep2tbYQg0ibxOBdIaxjfeR/exec?token=AnSinhXaHoi@2026';
export default function RecordsList() {
  const { user } = useAuth();
  const { records, isLoading, refreshRecords } = useRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<SocialRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Processing Form State
  const [processingData, setProcessingData] = useState({
    fullName: '',
    phone: '',
    oldAddress: '',
    col4: '',
    headOfHousehold: '',
    addressStatus: '',
    donorAddress: '',
    birthDate: '',
    cccd: '',
    residentAddress: '',
    familyCircumstance: '',
    issuedDate: '',
    supportType: '',
    col15: '',
    col16: '',
    supportHistory: '',
    supportNeed: '',
    objectOrTypeNeed: '',
    category: '',
    processingOfficer: '',
    coordinatingUnit: '',
    resolutionStatus: '',
    result: ''
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
    
    // Payload for Google App Script according to requested format
    const payload = {
      id: selectedRecord.id,
      hoTen: processingData.fullName,
      soDienThoai: processingData.phone,
      diaChiCu: processingData.oldAddress,
      cot4: processingData.col4,
      chuHo: processingData.headOfHousehold,
      tinhTrangHo: processingData.addressStatus,
      diaChiNhaHaoTam: processingData.donorAddress,
      ngaySinh: processingData.birthDate,
      cccd: processingData.cccd,
      hoKhau: processingData.residentAddress,
      hoanCanh: processingData.familyCircumstance,
      ngayCap: processingData.issuedDate,
      hinhThucHoTro: processingData.supportType,
      cot15: processingData.col15,
      cot16: processingData.col16,
      lichSuHoTro: processingData.supportHistory,
      nhuCau: processingData.supportNeed,
      doiTuongHoTro: processingData.objectOrTypeNeed,
      doiTuong: processingData.category,
      canBo: processingData.processingOfficer,
      phoiHop: processingData.coordinatingUnit,
      tinhTrang: processingData.resolutionStatus,
      ketQua: processingData.result
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

      {/* Records List Section */}
      <div className="space-y-4">
        {/* Desktop Table View */}
        <div className="hidden md:block glass-card overflow-hidden">
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
                                                fullName: record.fullName || '',
                                                phone: record.phone || '',
                                                oldAddress: record.oldAddress || '',
                                                col4: record.col4 || '',
                                                headOfHousehold: record.headOfHousehold || '',
                                                addressStatus: record.addressStatus || '',
                                                donorAddress: record.donorAddress || '',
                                                birthDate: record.birthDate || '',
                                                cccd: record.cccd || '',
                                                residentAddress: record.residentAddress || '',
                                                familyCircumstance: record.familyCircumstance || '',
                                                issuedDate: record.issuedDate || '',
                                                supportType: record.supportType || '',
                                                col15: record.col15 || '',
                                                col16: record.col16 || '',
                                                supportHistory: record.supportHistory || '',
                                                supportNeed: record.supportNeed || '',
                                                objectOrTypeNeed: record.objectOrTypeNeed || '',
                                                category: record.category || '',
                                                processingOfficer: record.processingOfficer || user?.fullName || '',
                                                coordinatingUnit: record.coordinatingUnit || '',
                                                resolutionStatus: record.resolutionStatus || '',
                                                result: record.result || ''
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
        </div>

        {/* Mobile List View (Cards) */}
        <div className="grid grid-cols-1 md:hidden gap-4">
            {filteredRecords.map((record, i) => (
                <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-5 space-y-4 border-l-4 border-l-brand-primary"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{record.id}</span>
                            <h4 className="text-lg font-bold text-slate-900 leading-tight">{record.fullName}</h4>
                            <p className="text-xs font-semibold text-brand-primary mt-0.5">{record.category}</p>
                        </div>
                        <span className={cn("badge text-[10px]", 
                            record.resolutionStatus === 'Hoàn thành' ? "badge-complete" :
                            record.resolutionStatus === 'Đang xử lý' ? "badge-processing" : "badge-urgent"
                        )}>
                            {record.resolutionStatus}
                        </span>
                    </div>

                    <div className="space-y-2 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-2 text-slate-500">
                            <MapPin size={14} className="shrink-0 text-brand-secondary" />
                            <span className="text-[11px] font-medium leading-tight">{record.oldAddress}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Phone size={14} className="shrink-0 text-brand-accent" />
                            <span className="text-[11px] font-medium">{record.phone}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            setSelectedRecord(record);
                            setProcessingData({
                                fullName: record.fullName || '',
                                phone: record.phone || '',
                                oldAddress: record.oldAddress || '',
                                col4: record.col4 || '',
                                headOfHousehold: record.headOfHousehold || '',
                                addressStatus: record.addressStatus || '',
                                donorAddress: record.donorAddress || '',
                                birthDate: record.birthDate || '',
                                cccd: record.cccd || '',
                                residentAddress: record.residentAddress || '',
                                familyCircumstance: record.familyCircumstance || '',
                                issuedDate: record.issuedDate || '',
                                supportType: record.supportType || '',
                                col15: record.col15 || '',
                                col16: record.col16 || '',
                                supportHistory: record.supportHistory || '',
                                supportNeed: record.supportNeed || '',
                                objectOrTypeNeed: record.objectOrTypeNeed || '',
                                category: record.category || '',
                                processingOfficer: record.processingOfficer || user?.fullName || '',
                                coordinatingUnit: record.coordinatingUnit || '',
                                resolutionStatus: record.resolutionStatus || '',
                                result: record.result || ''
                            });
                        }}
                        className="w-full bg-brand-primary text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/20 active:scale-[0.98] transition-all"
                    >
                        {user?.role === 'CITIZEN' ? 'Xem chi tiết hồ sơ' : 'Tiến hành xử lý hồ sơ'}
                    </button>
                </motion.div>
            ))}
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
              <div className={cn("p-8 space-y-8", user?.role === 'CITIZEN' ? "" : "bg-slate-50/30")}>
                {user?.role === 'CITIZEN' ? (
                  /* CITIZEN VIEW: Read-only visual layout */
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
                ) : (
                  /* OFFICER/ADMIN VIEW: Comprehensive Editable Form */
                  <div className="space-y-10">
                    <section className="space-y-4">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                        <UserIcon size={16} className="text-brand-primary" />
                        Thông tin định danh & Cá nhân
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Họ và tên</label>
                          <input type="text" value={processingData.fullName} onChange={e => setProcessingData({...processingData, fullName: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Số điện thoại</label>
                          <input type="text" value={processingData.phone} onChange={e => setProcessingData({...processingData, phone: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ngày sinh</label>
                          <input type="text" placeholder="DD/MM/YYYY" value={processingData.birthDate} onChange={e => setProcessingData({...processingData, birthDate: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Số CCCD</label>
                          <input type="text" value={processingData.cccd} onChange={e => setProcessingData({...processingData, cccd: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                        <MapPin size={16} className="text-brand-primary" />
                        Địa chỉ & Hộ khẩu
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Địa chỉ cũ trước sáp nhập</label>
                          <input type="text" value={processingData.oldAddress} onChange={e => setProcessingData({...processingData, oldAddress: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hộ khẩu thường trú</label>
                          <input type="text" value={processingData.residentAddress} onChange={e => setProcessingData({...processingData, residentAddress: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Họ và tên chủ hộ</label>
                          <input type="text" value={processingData.headOfHousehold} onChange={e => setProcessingData({...processingData, headOfHousehold: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ngày cấp CCCD</label>
                          <input type="text" value={processingData.issuedDate} onChange={e => setProcessingData({...processingData, issuedDate: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                        <ClipboardCheck size={16} className="text-brand-primary" />
                        Phân loại & Hoàn cảnh
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đối tượng (Category)</label>
                          <select 
                            value={processingData.category} 
                            onChange={e => setProcessingData({...processingData, category: e.target.value})}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-bold text-slate-700"
                          >
                            <option value="Hộ nghèo">Hộ nghèo</option>
                            <option value="Hộ cận nghèo">Hộ cận nghèo</option>
                            <option value="Hộ gia đình chính sách">Hộ gia đình chính sách</option>
                            <option value="Đối tượng bảo trợ">Đối tượng bảo trợ</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phân loại (Cột 4)</label>
                          <input type="text" value={processingData.col4} onChange={e => setProcessingData({...processingData, col4: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hoàn cảnh gia đình</label>
                          <textarea rows={2} value={processingData.familyCircumstance} onChange={e => setProcessingData({...processingData, familyCircumstance: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tình trạng hộ (tình trạng)</label>
                          <input type="text" value={processingData.addressStatus} onChange={e => setProcessingData({...processingData, addressStatus: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Địa chỉ nhà hảo tâm</label>
                          <input type="text" value={processingData.donorAddress} onChange={e => setProcessingData({...processingData, donorAddress: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                        <TrendingUp size={16} className="text-brand-primary" />
                        Nhu cầu & Hình thức hỗ trợ
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhu cầu hỗ trợ</label>
                          <input type="text" value={processingData.supportNeed} onChange={e => setProcessingData({...processingData, supportNeed: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hình thức hỗ trợ</label>
                          <input type="text" value={processingData.supportType} onChange={e => setProcessingData({...processingData, supportType: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Đối tượng hoặc hình thức hỗ trợ</label>
                          <input type="text" value={processingData.objectOrTypeNeed} onChange={e => setProcessingData({...processingData, objectOrTypeNeed: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cột 15</label>
                          <input type="text" value={processingData.col15} onChange={e => setProcessingData({...processingData, col15: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cột 16</label>
                          <input type="text" value={processingData.col16} onChange={e => setProcessingData({...processingData, col16: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                      </div>
                    </section>
                    
                    <section className="space-y-4">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                        <Activity size={16} className="text-emerald-500" />
                        Trạng thái xử lý & Kết quả
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tình trạng giải quyết</label>
                          <select 
                            value={processingData.resolutionStatus} 
                            onChange={e => setProcessingData({...processingData, resolutionStatus: e.target.value})}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-bold text-slate-700"
                          >
                            <option value="Mới tiếp nhận">Mới tiếp nhận</option>
                            <option value="Kiểm tra hồ sơ">Kiểm tra hồ sơ</option>
                            <option value="Phối hợp xử lý lại đơn vị">Phối hợp xử lý lại đơn vị</option>
                            <option value="Đang xử lý">Đang xử lý</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                            <option value="Trả kết quả">Trả kết quả</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cán bộ thực hiện</label>
                          <input type="text" value={processingData.processingOfficer} onChange={e => setProcessingData({...processingData, processingOfficer: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cá nhân hoặc Đơn vị phối hợp</label>
                          <input type="text" value={processingData.coordinatingUnit} onChange={e => setProcessingData({...processingData, coordinatingUnit: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kết quả</label>
                          <textarea rows={2} value={processingData.result} onChange={e => setProcessingData({...processingData, result: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lịch sử hỗ trợ (Ghi chú mới)</label>
                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 mb-2">
                              <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Lịch sử cũ (Chỉ xem):</p>
                              <p className="text-xs text-slate-600 italic">{selectedRecord.supportHistory || "Không có lịch sử cũ"}</p>
                            </div>
                            <textarea rows={3} value={processingData.supportHistory} onChange={e => setProcessingData({...processingData, supportHistory: e.target.value})} placeholder="Cập nhật diễn biến hỗ trợ mới nhất..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                        </div>
                      </div>
                    </section>

                    <div className="flex gap-4 pt-4 border-t">
                      <button onClick={() => setSelectedRecord(null)} className="flex-1 px-6 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">Hủy bỏ</button>
                      <button 
                        onClick={handleProcess} 
                        disabled={isUpdating}
                        className={cn("flex-[2] brand-gradient text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70", isUpdating && "animate-pulse")}
                      >
                        {isUpdating ? "Đang đồng bộ..." : <><CheckCircle2 size={20} /> Cập nhật tất cả</>}
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
