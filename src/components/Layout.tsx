import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, LogOut, User, Menu, X, FolderOpen, FileText, Palette } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Bảng điều khiển', path: '/', icon: LayoutDashboard },
    { label: 'Hồ sơ an sinh', path: '/records', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 brand-gradient text-white flex-col sticky top-0 h-screen border-r border-white/10">
        <div className="p-8 border-bottom border-white/10 text-center">
          <div className="w-12 h-12 bg-brand-secondary rounded-full mx-auto mb-3 border-3 border-brand-primary flex items-center justify-center p-1 shadow-lg">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg/500px-Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <h1 className="font-extrabold text-sm tracking-tight leading-tight uppercase">An sinh Xã hội Số</h1>
            <p className="text-[10px] text-brand-secondary/80 font-bold tracking-widest leading-none">PORTAL QUẢN TRỊ</p>
          </div>
        </div>

        <nav className="flex-1 mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-6 py-3 transition-all duration-200 border-l-4",
                  isActive
                    ? "bg-white/10 border-brand-secondary text-white opacity-100"
                    : "border-transparent text-white/70 hover:bg-white/5 hover:opacity-100"
                )}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Google Drive Links */}
          <div className="mt-2 px-4">
            <div className="space-y-1">
              <a
                href="https://drive.google.com/file/d/1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb/view"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
              >
                <FileText size={18} />
                <span className="text-sm">Ds hộ nghèo</span>
              </a>

              <a
                href="https://drive.google.com/file/d/1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb/view"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
              >
                <FileText size={18} />
                <span className="text-sm">Ds hộ cận nghèo</span>
              </a>

              <a
                href="https://drive.google.com/drive/folders/1km49MdnRfnGUTIZsQRSfvvR5unUpXMBy?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
              >
                <FileText size={18} />
                <span className="text-sm">Ds hộ gđ chính sách</span>
              </a>

              <a
                href="https://drive.google.com/drive/folders/1km49MdnRfnGUTIZsQRSfvvR5unUpXMBy?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
              >
                <FileText size={18} />
                <span className="text-sm">Ds bảo trợ XH</span>
              </a>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center space-x-3 mb-4 opacity-80">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center">
              <User size={16} className="text-brand-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold truncate leading-tight">{user?.fullName}</p>
              <p className="text-[9px] text-white/50 uppercase tracking-tighter leading-tight font-black">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-xs font-bold"
          >
            <LogOut size={14} />
            <span>Đăng xuất</span>
          </button>
          <p className="text-[9px] text-white/30 text-center mt-3 uppercase tracking-widest font-bold">phiên bản v2.4.0</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden brand-gradient text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg/500px-Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold">An sinh Xã hội Số</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[60px] z-40 md:hidden bg-white flex flex-col p-6 space-y-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-4 p-4 rounded-xl",
                  location.pathname === item.path ? "bg-brand-primary/10 text-brand-primary" : "text-slate-600"
                )}
              >
                <item.icon size={22} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            <div className="pt-6 border-t mt-auto">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 p-4 text-rose-600 bg-rose-50 rounded-xl font-medium"
              >
                <LogOut size={20} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
