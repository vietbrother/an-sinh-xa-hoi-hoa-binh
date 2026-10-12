import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, LogOut, User, Menu, X, Users, Paperclip, ExternalLink } from 'lucide-react';
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
    ...(user?.role === 'ADMIN' ? [{ label: 'Người dùng', path: '/users', icon: Users }] : []),
  ];

  const driveLinks = [
    {
      label: 'Ds hộ nghèo',
      url: 'https://drive.google.com/file/d/1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb/view',
    },
    {
      label: 'Ds hộ cận nghèo',
      url: 'https://drive.google.com/file/d/1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb/view',
    },
    {
      label: 'Ds hộ gđ chính sách',
      url: 'https://drive.google.com/drive/folders/16snkJ-4uX4k0zUPG54n2YXsYKIDnWwF6?usp=drive_link',
    },
    {
      label: 'Ds bảo trợ XH',
      url: 'https://drive.google.com/drive/folders/1km49MdnRfnGUTIZsQRSfvvR5unUpXMBy?usp=drive_link',
    },
    {
      label: 'Ds tặng quà',
      url: 'https://drive.google.com/drive/folders/1CAyhZKSYJnGFWZdgZcxfcu9IpY7SXHOf?usp=drive_link',
    },
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

        <nav className="flex-1 mt-6 space-y-1 overflow-y-auto">
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
          <div className="mt-2 px-4 ml-0">
            <div className="space-y-1">
              {driveLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
                >
                  <Paperclip size={18} />
                  <span className="text-sm">{link.label}</span>
                </a>
              ))}
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
          <div>
            <span className="font-bold block leading-tight">An sinh Xã hội Số</span>
            <span className="text-[9px] text-brand-secondary uppercase tracking-wider font-semibold">Portal Quản Trị</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Chuyển đổi menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[60px] z-40 md:hidden bg-white flex flex-col p-5 space-y-5 overflow-y-auto shadow-2xl"
          >
            {/* Main Navigation Pages */}
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Chức năng chính
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                      isActive
                        ? "bg-brand-primary text-white shadow-sm font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <Icon size={20} className={isActive ? "text-brand-secondary" : "text-slate-500"} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Google Drive Links / Tài liệu đính kèm */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Danh sách & Tài liệu Drive
              </p>
              <div className="space-y-1">
                {driveLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-brand-primary transition-all text-sm group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-brand-primary/10 flex items-center justify-center text-slate-500 group-hover:text-brand-primary transition-colors">
                        <Paperclip size={16} />
                      </div>
                      <span className="font-medium text-slate-700 group-hover:text-brand-primary">{link.label}</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-brand-primary" />
                  </a>
                ))}
              </div>
            </div>

            {/* User Profile & Logout section */}
            <div className="pt-4 border-t border-slate-100 mt-auto space-y-3 pb-6">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.fullName || 'Người dùng'}</p>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary">
                      {user?.role}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">{user?.email}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl font-bold text-sm transition-colors border border-rose-200/60 shadow-sm"
              >
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </button>

              <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-semibold pt-1">
                Phiên bản v2.4.0
              </p>
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
