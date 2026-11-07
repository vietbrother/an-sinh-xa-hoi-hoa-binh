import React, { useState } from 'react';
import {
  FileText,
  FolderOpen,
  ExternalLink,
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Share2
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface DriveItem {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'docx';
  size: string;
  updatedAt: string;
  driveFileId?: string;
  downloadUrl?: string;
}

interface DriveDocumentViewerProps {
  title: string;
  category?: string;
  url: string;
  description?: string;
  className?: string;
  initialMode?: 'embed' | 'files';
}

// Curated document manifests for Google Drive folders
const FOLDER_DOCUMENTS: Record<string, DriveItem[]> = {
  // Folder: Ds hộ gđ chính sách (16snkJ-4uX4k0zUPG54n2YXsYKIDnWwF6)
  '16snkJ-4uX4k0zUPG54n2YXsYKIDnWwF6': [
    {
      id: 'cs-01',
      name: 'Quyết định 214/QĐ-UBND phê duyệt danh sách hộ người có công 2026.pdf',
      type: 'pdf',
      size: '2.4 MB',
      updatedAt: '05/01/2026',
      driveFileId: '1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb',
    },
    {
      id: 'cs-02',
      name: 'Danh sách tổng hợp hộ chính sách, thương bệnh binh 7 phường.xlsx',
      type: 'xlsx',
      size: '1.1 MB',
      updatedAt: '12/01/2026',
    },
    {
      id: 'cs-03',
      name: 'Hướng dẫn chính sách điều dưỡng và trợ cấp ưu đãi người có công.pdf',
      type: 'pdf',
      size: '1.8 MB',
      updatedAt: '18/02/2026',
      driveFileId: '1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb',
    },
    {
      id: 'cs-04',
      name: 'Biên bản rà soát hộ gia đình chính sách khó khăn về nhà ở.docx',
      type: 'docx',
      size: '860 KB',
      updatedAt: '02/03/2026',
    },
  ],

  // Folder: Ds bảo trợ XH (1km49MdnRfnGUTIZsQRSfvvR5unUpXMBy)
  '1km49MdnRfnGUTIZsQRSfvvR5unUpXMBy': [
    {
      id: 'bt-01',
      name: 'Quyết định 188/QĐ-UBND trợ cấp xã hội thường xuyên năm 2026.pdf',
      type: 'pdf',
      size: '3.1 MB',
      updatedAt: '08/01/2026',
      driveFileId: '1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb',
    },
    {
      id: 'bt-02',
      name: 'Danh sách đối tượng khuyết tật nặng và người cao tuổi cô đơn.xlsx',
      type: 'xlsx',
      size: '950 KB',
      updatedAt: '15/01/2026',
    },
    {
      id: 'bt-03',
      name: 'Báo cáo chi trả trợ cấp bảo trợ xã hội qua tài khoản ngân hàng.pdf',
      type: 'pdf',
      size: '1.4 MB',
      updatedAt: '25/02/2026',
      driveFileId: '1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb',
    },
  ],

  // Folder: Ds tặng quà (1CAyhZKSYJnGFWZdgZcxfcu9IpY7SXHOf)
  '1CAyhZKSYJnGFWZdgZcxfcu9IpY7SXHOf': [
    {
      id: 'tq-01',
      name: 'Kế hoạch trao tặng 2.500 suất quà an sinh Xuân 2026.pdf',
      type: 'pdf',
      size: '2.8 MB',
      updatedAt: '10/01/2026',
      driveFileId: '1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb',
    },
    {
      id: 'tq-02',
      name: 'Biên bản bàn giao và phân bổ quà tặng từ các nhà tài trợ.pdf',
      type: 'pdf',
      size: '1.9 MB',
      updatedAt: '20/01/2026',
      driveFileId: '1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb',
    },
    {
      id: 'tq-03',
      name: 'Bảng theo dõi số lượng quà an sinh đã trao tặng tại các tổ dân phố.xlsx',
      type: 'xlsx',
      size: '1.3 MB',
      updatedAt: '01/02/2026',
    },
    {
      id: 'tq-04',
      name: 'Danh sách thư cảm ơn các cơ quan doanh nghiệp ủng hộ quà tặng.docx',
      type: 'docx',
      size: '640 KB',
      updatedAt: '10/02/2026',
    },
  ],
};

export default function DriveDocumentViewer({
  title,
  category,
  url,
  description,
  className = '',
  initialMode = 'embed',
}: DriveDocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'embed' | 'files'>(initialMode);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Detect whether link is a file or a folder
  const isFolder = url.includes('/folders/');
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);

  const folderId = folderMatch ? folderMatch[1] : '';
  const fileId = fileMatch ? fileMatch[1] : (url.match(/id=([a-zA-Z0-9_-]+)/)?.[1] || '');

  // Active file to preview
  const currentPreviewFileId = selectedFileId || fileId || '1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb';

  // Build embed URLs
  const filePreviewUrl = `https://drive.google.com/file/d/${currentPreviewFileId}/preview`;
  const folderEmbedUrl = folderId
    ? `https://drive.google.com/embeddedfolderview?id=${folderId}#list`
    : '';

  // Get curated documents for this folder
  const documents = folderId && FOLDER_DOCUMENTS[folderId] ? FOLDER_DOCUMENTS[folderId] : [];
  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReload = () => {
    setIsLoading(true);
    const iframe = document.getElementById('drive-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div
      className={cn(
        'glass-card overflow-hidden flex flex-col bg-white border border-slate-200/80 rounded-3xl shadow-lg transition-all duration-300',
        isFullscreen
          ? 'fixed inset-2 md:inset-6 z-[100] h-[calc(100vh-16px)] md:h-[calc(100vh-48px)] shadow-2xl'
          : 'w-full',
        className
      )}
    >
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-secondary shrink-0">
            {isFolder ? <FolderOpen size={20} /> : <FileText size={20} />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-bold text-white truncate">{title}</h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-secondary text-slate-900 shrink-0">
                {isFolder ? 'Thư mục Drive' : 'File PDF'}
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate mt-0.5">
              {description || (isFolder ? 'Thư mục tài liệu trực tuyến đồng bộ Google Drive' : 'Văn bản / Báo cáo định dạng chuẩn PDF')}
            </p>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
          {/* Switch tabs if it is a folder */}
          {isFolder && (
            <div className="flex items-center bg-white/10 p-1 rounded-xl mr-2">
              <button
                onClick={() => setActiveTab('embed')}
                className={cn(
                  'px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5',
                  activeTab === 'embed'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-white/70 hover:text-white'
                )}
              >
                <Layers size={13} />
                <span className="hidden sm:inline">Khung Drive</span>
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={cn(
                  'px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5',
                  activeTab === 'files'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-white/70 hover:text-white'
                )}
              >
                <FileText size={13} />
                <span>Danh sách ({documents.length})</span>
              </button>
            </div>
          )}

          <button
            onClick={handleReload}
            title="Tải lại nội dung"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <RefreshCw size={15} />
          </button>

          <button
            onClick={handleCopyLink}
            title="Sao chép liên kết"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors relative"
          >
            <Share2 size={15} />
            {copied && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] text-brand-secondary font-bold px-2 py-1 rounded shadow whitespace-nowrap z-30">
                Đã sao chép!
              </span>
            )}
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Mở trên Google Drive"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ExternalLink size={15} />
            <span className="hidden sm:inline">Drive gốc</span>
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            className="p-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span className="hidden sm:inline">{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative bg-slate-100 min-h-[380px] md:min-h-[560px]">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-3 shadow-md" />
            <p className="text-sm font-bold text-slate-800">Đang nạp dữ liệu từ Google Drive...</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Trình nhúng bảo mật đang đồng bộ trực tiếp văn bản, vui lòng chờ trong giây lát
            </p>
          </div>
        )}

        {/* View Mode 1: Folder File List Tab */}
        {isFolder && activeTab === 'files' ? (
          <div className="p-4 md:p-6 flex flex-col h-full bg-slate-50">
            {/* Search Filter */}
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài liệu trong thư mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-primary"
                />
              </div>
              <span className="text-xs font-bold text-slate-500 self-end sm:self-center">
                Hiển thị {filteredDocs.length} / {documents.length} văn bản số hóa
              </span>
            </div>

            {/* Document Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 overflow-y-auto max-h-[500px] pr-1">
              {filteredDocs.map((doc) => {
                const isSelected = selectedFileId === doc.driveFileId;
                return (
                  <div
                    key={doc.id}
                    className={cn(
                      'p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 bg-white hover:shadow-md group',
                      isSelected
                        ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-primary/5'
                        : 'border-slate-200/80 hover:border-brand-primary/40'
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs',
                          doc.type === 'pdf'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : doc.type === 'xlsx'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        )}
                      >
                        {doc.type.toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs md:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-brand-primary transition-colors">
                          {doc.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {doc.updatedAt}
                          </span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 size={11} /> Đã kiểm duyệt
                      </span>
                      <div className="flex items-center gap-2">
                        {doc.driveFileId ? (
                          <button
                            onClick={() => {
                              setSelectedFileId(doc.driveFileId || null);
                              setActiveTab('embed');
                              setIsLoading(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-1 shadow-sm"
                          >
                            <Eye size={13} />
                            <span>Xem nhúng ngay</span>
                          </button>
                        ) : (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <Download size={13} />
                            <span>Mở thư mục</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* View Mode 2: Embedded Google Drive Preview (File or Folder) */
          <div className="w-full h-full flex-1 relative flex flex-col">
            <iframe
              id="drive-iframe"
              src={isFolder && !selectedFileId ? folderEmbedUrl : filePreviewUrl}
              title={title}
              onLoad={() => setIsLoading(false)}
              className="w-full flex-1 border-0 min-h-[420px] md:min-h-[580px] bg-white"
              allow="autoplay; fullscreen"
            />
            {/* Bottom helper bar for mobile touch users */}
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-brand-primary" />
                <span className="font-semibold text-slate-700">Chế độ xem nhúng trực tuyến</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="font-bold text-brand-primary hover:underline"
                >
                  {isFullscreen ? 'Thu nhỏ lại' : 'Phóng to xem dễ hơn'}
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-500 hover:text-slate-800"
                >
                  Mở tab mới nếu tải chậm
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
