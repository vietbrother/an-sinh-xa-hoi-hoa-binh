import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Heart,
  Users,
  Building2,
  FileText,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Award
} from 'lucide-react';
import SocialCareCategoriesSection from '../components/SocialCareCategoriesSection';
import TopDonorsHonors from '../components/TopDonorsHonors';
import trongDongBg from '../static/trong-dong.jpg';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* Top Public Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Agency Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-brand-secondary p-1 border-2 border-brand-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg/500px-Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg.png"
                alt="Logo MTTQ Việt Nam"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 uppercase">
                  An sinh Xã hội Số
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  Cổng Thông Tin Công Khai
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Ủy ban Mặt trận Tổ quốc Việt Nam • TP Hòa Bình
              </p>
            </div>
          </Link>

          {/* Center Navigation Shortcuts (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold text-slate-600">
            <button
              onClick={() => scrollToSection('categories-section')}
              className="hover:text-brand-primary transition-colors cursor-pointer"
            >
              Hồ sơ & Danh mục
            </button>
            <button
              onClick={() => scrollToSection('donors-section')}
              className="hover:text-brand-primary transition-colors cursor-pointer"
            >
              Vinh danh Nhà tài trợ
            </button>
            <button
              onClick={() => scrollToSection('commitments-section')}
              className="hover:text-brand-primary transition-colors cursor-pointer"
            >
              Cam kết Minh bạch
            </button>
          </nav>

          {/* Top Right: Auth Button or User Badge */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="hidden sm:flex items-center space-x-2 p-1.5 px-3 rounded-full bg-slate-100 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <User size={13} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                    {user?.fullName}
                  </span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-brand-primary text-white">
                    {user?.role}
                  </span>
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs shadow-md shadow-brand-primary/20 transition-all hover:scale-102"
                >
                  <LayoutDashboard size={15} />
                  <span>Vào Bảng điều khiển</span>
                </Link>

                <button
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-rose-600 hover:from-brand-primary/95 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-brand-primary/25 transition-all hover:scale-102"
              >
                <LogIn size={15} />
                <span>Đăng nhập Cán bộ / Quản trị</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Trong Dong Sacred Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#77011f] via-[#8B0018] to-[#500010] text-white py-12 md:py-20 border-b border-brand-secondary/30">
        {/* Background Image: Trong Dong */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url(${trongDongBg})` }}
        />

        {/* Ambient Radial Gradient Lights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-primary/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Emblem & Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-brand-secondary/40 text-brand-secondary text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles size={14} className="text-brand-secondary" />
            <span>Chung tay vì người nghèo • Không để ai bị bỏ lại phía sau</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl uppercase text-white drop-shadow-md">
            Cổng Thông Tin <span className="text-brand-secondary">An Sinh Xã Hội Số</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90 max-w-3xl leading-relaxed font-normal">
            Hệ thống quản lý, giám sát và phân bổ nguồn lực an sinh xã hội minh bạch, kịp thời cho các hộ nghèo, hộ cận nghèo, gia đình chính sách và đối tượng bảo trợ trên địa bàn.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => scrollToSection('categories-section')}
              className="px-5 py-3 rounded-xl bg-brand-secondary hover:bg-brand-secondary/90 text-slate-900 font-black text-xs uppercase tracking-wider shadow-lg shadow-black/20 flex items-center gap-2 transition-all hover:scale-103 cursor-pointer"
            >
              <FileText size={16} />
              <span>Xem danh mục hồ sơ an sinh</span>
            </button>

            <button
              onClick={() => scrollToSection('donors-section')}
              className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md flex items-center gap-2 transition-all hover:scale-103 cursor-pointer"
            >
              <Award size={16} className="text-brand-secondary" />
              <span>Vinh danh nhà tài trợ</span>
            </button>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-5 py-3 rounded-xl bg-black/30 hover:bg-black/50 border border-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md flex items-center gap-2 transition-all"
              >
                <LogIn size={16} />
                <span>Cán bộ đăng nhập</span>
              </Link>
            )}
          </div>

          {/* 4 Pillars Summary Metric Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mt-12">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center">
              <span className="text-xl sm:text-2xl font-black text-brand-secondary block">1,248+</span>
              <span className="text-[11px] sm:text-xs text-white/80 font-medium">Hồ sơ đã số hóa</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center">
              <span className="text-xl sm:text-2xl font-black text-brand-secondary block">7/7</span>
              <span className="text-[11px] sm:text-xs text-white/80 font-medium">Phường/Xã phủ sóng GIS</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center">
              <span className="text-xl sm:text-2xl font-black text-brand-secondary block">196.3+ Tr</span>
              <span className="text-[11px] sm:text-xs text-white/80 font-medium">Kinh phí đã vận động</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center">
              <span className="text-xl sm:text-2xl font-black text-brand-secondary block">100%</span>
              <span className="text-[11px] sm:text-xs text-white/80 font-medium">Đúng đối tượng thụ hưởng</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Public Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16 flex-1 w-full">
        {/* Section 1: Social Care Categories (5 Cards with embedded Google Drive viewer) */}
        <section id="categories-section" className="scroll-mt-24">
          <SocialCareCategoriesSection />
        </section>

        {/* Section 2: Top Donors Honors with Fireworks bloom animation for Top 1 */}
        <section id="donors-section" className="scroll-mt-24">
          <TopDonorsHonors />
        </section>

        {/* Section 3: Transparency Commitments & Guidelines */}
        <section id="commitments-section" className="scroll-mt-24">
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-md">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-wider mb-2">
                <ShieldCheck size={14} />
                Phương Châm Hành Động
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Cam Kết Minh Bạch & Phục Vụ Nhân Dân
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Công tác an sinh xã hội được quản trị số hóa nghiêm ngặt, đảm bảo mỗi sự đóng góp đều đến đúng địa chỉ và kịp thời.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Đúng đối tượng</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rà soát hộ tịch đa chiều kết hợp với cơ sở dữ liệu quốc gia, ngăn chặn trùng lặp hoặc bỏ sót đối tượng.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Kịp thời & Thiết thực</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ứng cứu khẩn cấp các hoàn cảnh ngặt nghèo, hỗ trợ sinh kế lâu dài để thoát nghèo bền vững.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Building2 size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Công khai nguồn lực</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Toàn bộ kinh phí và hiện vật ủng hộ của các nhà tài trợ đều được cập nhật minh bạch trên cổng thông tin.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Users size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Đồng hành gắn kết</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tạo cầu nối trực tiếp giữa các nhà hảo tâm và bà con khó khăn dưới sự giám sát của Mặt trận Tổ quốc.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg/500px-Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h4 className="font-bold text-sm tracking-tight leading-tight uppercase">
                    Ủy ban Mặt trận Tổ quốc Việt Nam
                  </h4>
                  <p className="text-xs text-brand-secondary font-semibold">Hệ thống An sinh Xã hội Số</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nền tảng chuyển đổi số ứng dụng công nghệ thông tin trong công tác an sinh xã hội, vì mục tiêu ấm no, hạnh phúc của mọi tầng lớp nhân dân.
              </p>
            </div>

            {/* Col 2 */}
            <div className="space-y-2 text-xs text-slate-400">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-2">Thông tin liên hệ</h4>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-brand-primary shrink-0" />
                <span>Trụ sở: Phường Phương Lâm, Thành phố Hòa Bình, Tỉnh Hòa Bình</span>
              </p>
              <p>Email tiếp nhận phản ánh: <span className="text-white font-medium">mttq.hoabinh@gmail.com</span></p>
              <p>Đường dây nóng hỗ trợ: <span className="text-brand-secondary font-bold">1900 8888</span></p>
            </div>

            {/* Col 3 */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider">Cán bộ & Quản trị</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dành cho cán bộ phụ trách công tác an sinh, rà soát hộ tịch và phân bổ nguồn lực tại các phường xã.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/10"
              >
                <LogIn size={14} />
                <span>Đăng nhập hệ thống cán bộ</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 SocialCare Connect • Ủy ban MTTQ Việt Nam. Tất cả quyền được bảo lưu.</p>
            <p className="uppercase tracking-widest font-semibold text-[10px] text-slate-400">
              Phiên bản sản phẩm v2.4.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
