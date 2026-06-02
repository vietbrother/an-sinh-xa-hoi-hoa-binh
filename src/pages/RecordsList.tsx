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

const YOUR_GAS_URL = 'https://script.google.com/macros/s/AKfycbye05mqpv2R7NH4cGTFev00zuVLCMqBJTA3TNh3wPY1aEoAu0otJNcA2VMPgVz6tw/exec?token=AnSinhXaHoi@2026';
import { RecordsModal } from './RecordsModal';

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
    result: '',
    
    // New fields
    contactPhone: '',
    updatedSupportStatus: '',
    supportHistoryNew: '',
    supportHistoryLast: ''
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
      chuHo: processingData.headOfHousehold,
      ngaySinh: processingData.birthDate,
      cccd: processingData.cccd,
      ngayCap: processingData.issuedDate,
      soDienThoaiLienHe: processingData.contactPhone,
      laDoiTuong: processingData.category,
      tinhTrangHoTro: processingData.addressStatus,
      diaChiCu: processingData.oldAddress,
      hoKhau: processingData.residentAddress,
      hoanCanh: processingData.familyCircumstance,
      nhuCau: processingData.supportNeed,
      lichSuCu: processingData.supportHistory,
      hinhThucHoTro: processingData.supportType,
      lichSuHoTro: processingData.supportHistoryLast,
      canBo: processingData.processingOfficer,
      phoiHop: processingData.coordinatingUnit,
      capNhatTinhTrangHoTro: processingData.updatedSupportStatus,
      tinhTrang: processingData.resolutionStatus,
      ketQua: processingData.result
    };

    try {
      console.log('Sending to Google App Script:', payload);
      console.log('Sending to Google App Script:', JSON.stringify(payload));
      
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
                                    <p className="text-sm font-bold text-slate-900 leading-none mb-1">{record.headOfHousehold || record.category}</p>
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
                                                result: record.result || '',
                                                contactPhone: record.contactPhone || '',
                                                updatedSupportStatus: record.updatedSupportStatus || '',
                                                supportHistoryNew: record.supportHistoryNew || '',
                                                supportHistoryLast: ''
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
                            <h4 className="text-lg font-bold text-slate-900 leading-tight">{record.headOfHousehold}</h4>
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
                                result: record.result || '',
                                contactPhone: record.contactPhone || '',
                                updatedSupportStatus: record.updatedSupportStatus || '',
                                supportHistoryNew: record.supportHistoryNew || '',
                                supportHistoryLast: ''
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
      <RecordsModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        selectedRecord={selectedRecord}
        processingData={processingData}
        setProcessingData={setProcessingData}
        isUpdating={isUpdating}
        onUpdate={handleProcess}
        userRole={user?.role}
      />

      {isLoading && (
        <div className="fixed bottom-8 right-8 bg-white shadow-2xl p-4 rounded-2xl border flex items-center gap-3 animate-bounce">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
            <span className="text-xs font-bold text-slate-600">Đang tải dữ liệu từ Google Sheets...</span>
        </div>
      )}
    </div>
  );
}
