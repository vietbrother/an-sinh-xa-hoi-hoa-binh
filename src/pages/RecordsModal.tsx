import React from 'react';
import { SocialRecord } from '../types';
import { 
  MapPin, User as UserIcon, AlertCircle, 
  MoreVertical, ClipboardCheck, TrendingUp, 
  Activity, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecord: SocialRecord | null;
  processingData: any;
  setProcessingData: React.Dispatch<React.SetStateAction<any>>;
  isUpdating: boolean;
  onUpdate: () => Promise<void>;
  userRole?: string;
}

export const RecordsModal: React.FC<RecordsModalProps> = ({
  isOpen,
  onClose,
  selectedRecord,
  processingData,
  setProcessingData,
  isUpdating,
  onUpdate,
  userRole
}) => {
  if (!selectedRecord) return null;
  console.log(selectedRecord);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                  <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                      <MoreVertical size={20} />
                  </button>
              </div>
              
              <h3 className="flex flex-wrap items-center gap-3 text-3xl font-black mb-2">
                <span>{selectedRecord.fullName}</span>

                <span className="inline-flex items-center h-8 px-3 rounded-full bg-brand-secondary/20 text-brand-secondary text-sm font-semibold border border-brand-secondary/30">
                  {processingData.category}
                </span>
              </h3>
              <div className="flex items-center gap-4 text-sm font-medium text-white/80">
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-brand-secondary" /> {selectedRecord.oldAddress}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span>{selectedRecord.id}</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className={cn("p-8 space-y-8", userRole === 'CITIZEN' ? "" : "bg-slate-50/30")}>
              {userRole === 'CITIZEN' ? (
                /* CITIZEN VIEW: Read-only visual layout */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <section>
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 block">Kết quả hỗ trợ</label>
                            <p className="text-sm font-bold text-brand-primary bg-brand-primary/5 px-4 py-2 rounded-xl inline-block border border-brand-primary/10">
                                {selectedRecord.result}
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
                        <section>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lịch sử hỗ trợ</label>
                          <div className="whitespace-pre-line -xs text-slate-600 italic">{selectedRecord.supportHistory || "Không có lịch sử hỗ trợ"}</div>
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
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Họ và tên chủ hộ</label>
                        <input type="text" value={processingData.fullName} onChange={e => setProcessingData({...processingData, fullName: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Số điện thoại</label>
                        <input type="text" value={processingData.phone} onChange={e => setProcessingData({...processingData, phone: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Số điện thoại liên hệ</label>
                        <input type="text" value={processingData.contactPhone || ''} onChange={e => setProcessingData({...processingData, contactPhone: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
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
                          <option value="Hộ khó khăn">Hộ khó khăn</option>
                          <option value="Hộ gia đình chính sách">Hộ gia đình chính sách</option>
                          <option value="Đối tượng bảo trợ">Đối tượng bảo trợ</option>
                          <option value="Khác">Khác</option>
                          <option value="Nhà hảo tâm">Nhà hảo tâm</option>
                        </select>
                      </div>
                      <div className={userRole == "OFFICER" ? "hidden" : ""}>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phân loại (Đối tượng cần hỗ trợ hay Nhà hảo tâm)</label>
                        <input type="text" value={processingData.col4} onChange={e => setProcessingData({...processingData, col4: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" placeholder="Nhập Đối tượng cần hỗ trợ hay Nhà hảo tâm" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hoàn cảnh gia đình</label>
                        <textarea rows={2} value={processingData.familyCircumstance} onChange={e => setProcessingData({...processingData, familyCircumstance: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>
                      <div className={userRole == "OFFICER" ? "hidden" : ""}>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tình trạng hỗ trợ</label>
                        <input type="text" value={processingData.addressStatus} onChange={e => setProcessingData({...processingData, addressStatus: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nhu cầu hỗ trợ</label>
                        <input type="text" value={processingData.supportNeed} onChange={e => setProcessingData({...processingData, supportNeed: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>
                    </div>
                  </section>

                  <section className={userRole == "OFFICER" ? "hidden" : "space-y-4"}>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                      <TrendingUp size={16} className="text-brand-primary" />
                      Nhu cầu & Hình thức hỗ trợ
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cập nhật tình trạng hỗ trợ</label>
                        <input type="text" value={processingData.updatedSupportStatus || ''} onChange={e => setProcessingData({...processingData, updatedSupportStatus: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" placeholder="Nhập tình trạng hỗ trợ..." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cán bộ thực hiện</label>
                        <input type="text" value={processingData.processingOfficer} onChange={e => setProcessingData({...processingData, processingOfficer: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cá nhân hoặc Đơn vị phối hợp</label>
                        <input type="text" value={processingData.coordinatingUnit} onChange={e => setProcessingData({...processingData, coordinatingUnit: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>                        
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hình thức hỗ trợ</label>
                        <input type="text" value={processingData.supportType} onChange={e => setProcessingData({...processingData, supportType: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Địa chỉ nhà hảo tâm</label>
                        <input type="text" value={processingData.donorAddress} onChange={e => setProcessingData({...processingData, donorAddress: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kết quả</label>
                        <textarea rows={2} value={processingData.result} onChange={e => setProcessingData({...processingData, result: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>
                       <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lịch sử hỗ trợ (Ghi chú mới)</label>
                          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 mb-2">
                            <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Lịch sử trước đây:</p>
                            <div className="whitespace-pre-line -xs text-slate-600 italic">{selectedRecord.supportHistory || "Không có lịch sử cũ"}</div>
                          </div>
                          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 mb-2">
                            <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Lịch sử hỗ trợ mới thực hiện:</p>
                            <div className="whitespace-pre-line -xs text-slate-600 italic">{selectedRecord.supportHistoryNew || "Không có lịch sử cũ"}</div>
                          </div>
                          <textarea rows={3} value={processingData.supportHistoryLast || ''} onChange={e => setProcessingData({...processingData, supportHistoryLast: e.target.value})} placeholder="Cập nhật diễn biến hỗ trợ mới nhất..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-primary font-medium text-slate-800" />
                      </div>
                    </div>
                  </section>

                  <div className="flex gap-4 pt-4 border-t">
                    <button onClick={onClose} className="flex-1 px-6 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">Hủy bỏ</button>
                    <button 
                      onClick={onUpdate} 
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
  );
};
