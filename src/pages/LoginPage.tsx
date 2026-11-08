import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, Lock, User as UserIcon, AlertCircle, Eye, EyeOff, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'motion/react';
import trongDongTransparent from '../static/trong_dong_transparent.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const rawFrom = (location.state as any)?.from?.pathname;
  const from = rawFrom && rawFrom !== '/' && rawFrom !== '/home' ? rawFrom : '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-amber-50/20 to-slate-100 relative overflow-hidden">
      {/* Top Left: Back to Home Page Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/85 hover:bg-white text-slate-700 hover:text-brand-primary font-bold text-xs sm:text-sm border border-slate-200/90 shadow-md shadow-slate-200/50 backdrop-blur-md transition-all hover:scale-103 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-brand-primary shrink-0" />
          <span>Quay lại Trang chủ</span>
        </Link>
      </div>

      {/* Rotating Transparent Dong Son Drum Sacred Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <div className="w-[580px] h-[580px] sm:w-[720px] sm:h-[720px] md:w-[880px] md:h-[880px] opacity-15 sm:opacity-20 animate-slow-spin select-none">
          <img
            src={trongDongTransparent}
            alt="Trống Đồng Đông Sơn"
            className="w-full h-full object-contain filter drop-shadow-2xl"
          />
        </div>
        {/* Ambient atmospheric glows */}
        <div className="absolute w-[420px] h-[420px] bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute w-[360px] h-[360px] bg-brand-secondary/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary opacity-5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent opacity-5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 p-8 border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-brand-light rounded-3xl mb-6 shadow-sm">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg/500px-Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg.png" 
                    className="w-16 h-16 object-contain"
                    alt="Logo"
                />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Hệ thống An sinh Số</h1>
            <p className="text-slate-500">Mặt trận Tổ quốc Việt Nam</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tên đăng nhập</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
                  placeholder="admin / canbo / dan"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-rose-600 bg-rose-50 p-4 rounded-2xl text-sm border border-rose-100">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full brand-gradient text-white font-bold py-4 rounded-2xl shadow-lg border-b-4 border-brand-accent/30 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              <LogIn size={20} />
              <span>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-brand-primary transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-brand-primary" />
              <span>Về Trang chủ</span>
            </Link>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Phiên bản v2.4.0
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
