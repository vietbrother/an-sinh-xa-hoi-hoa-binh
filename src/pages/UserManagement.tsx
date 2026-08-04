import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserPlus, Search, Edit2, Trash2, Shield, 
  CheckCircle, XCircle, RefreshCw, Mail, Lock, User as UserIcon,
  X, AlertTriangle, ChevronRight, Filter, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserRole, UserStatus } from '../types';
import { getUsers, createUser, updateUser, deleteUser, CreateUserData, UpdateUserData } from '../services/userService';
import { cn } from '../lib/utils';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Delete confirm modal state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    email: '',
    role: 'OFFICER' as UserRole,
    status: 'ACTIVE' as UserStatus,
  });

  // Validation & feedback state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchUsersList = async (showLoadingState = true) => {
    if (showLoadingState) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      const res = await getUsers();
      if ((res.success || (res as any).success === 'true') && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res.data && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        showToast(res.message || 'Không thể tải danh sách người dùng', 'error');
      }
    } catch (err: any) {
      showToast('Lỗi khi kết nối máy chủ', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  // Filtered users based on search (Username & Full Name) and optional role
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return users.filter((u) => {
      const uname = String(u.username || '');
      const fname = String(u.fullName || '');
      const matchesSearch = 
        uname.toLowerCase().includes(term) ||
        fname.toLowerCase().includes(term);
      
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setShowPassword(false);
    setFormData({
      username: '',
      fullName: '',
      password: '',
      email: '',
      role: 'OFFICER',
      status: 'ACTIVE',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setShowPassword(false);
    setFormData({
      username: user.username || '',
      fullName: user.fullName || '',
      password: user.password || '',
      email: user.email || '',
      role: (user.role as UserRole) || 'CITIZEN',
      status: (user.status as UserStatus) || 'ACTIVE',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username bắt buộc.';
    } else {
      // Check duplicate username (if creating or changing username)
      const duplicate = users.find(
        (u) =>
          String(u.username || '').toLowerCase() === formData.username.trim().toLowerCase() &&
          (!editingUser || u.id !== editingUser.id)
      );
      if (duplicate) {
        newErrors.username = 'Username không được trùng.';
      }
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name bắt buộc.';
    }

    if (!editingUser && !formData.password.trim()) {
      newErrors.password = 'Password bắt buộc khi tạo mới.';
    }

    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Email không hợp lệ.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);

    try {
      if (editingUser) {
        // Update user
        const updatePayload: UpdateUserData = {
          id: editingUser.id,
          username: formData.username.trim(),
          fullName: formData.fullName.trim(),
          password: formData.password || editingUser.password,
          email: formData.email.trim(),
          role: formData.role,
          status: formData.status,
        };

        const res = await updateUser(updatePayload);
        const isSuccess =
          res.success === true ||
          (res as any).success === 'true' ||
          !!res.data?.id ||
          (res.message && (res.message.toLowerCase().includes('success') || res.message.toLowerCase().includes('thành công')));

        if (isSuccess) {
          showToast(res.message || 'Cập nhật người dùng thành công', 'success');
          setIsModalOpen(false);
          setUsers((prev) =>
            prev.map((u) => (u.id === updatePayload.id ? { ...u, ...updatePayload } : u))
          );
          fetchUsersList(false);
        } else {
          showToast(res.message || 'Cập nhật thất bại', 'error');
          if (res.message && res.message.toLowerCase().includes('username')) {
            setErrors((prev) => ({ ...prev, username: res.message }));
          }
        }
      } else {
        // Create user
        const createPayload: CreateUserData = {
          username: formData.username.trim(),
          fullName: formData.fullName.trim(),
          password: formData.password.trim(),
          email: formData.email.trim(),
          role: formData.role,
          status: formData.status,
        };

        const res = await createUser(createPayload);
        const isSuccess =
          res.success === true ||
          (res as any).success === 'true' ||
          !!res.data?.id ||
          (res.message && (res.message.toLowerCase().includes('thành công') || res.message.toLowerCase().includes('success')));

        if (isSuccess) {
          showToast(res.message || 'Tạo người dùng thành công', 'success');
          setIsModalOpen(false);
          const newId = res.data?.id || String(Date.now());
          setUsers((prev) => {
            const exists = prev.some((u) => String(u.username || '').toLowerCase() === createPayload.username.toLowerCase());
            if (!exists) {
              return [...prev, { ...createPayload, id: newId }];
            }
            return prev;
          });
          fetchUsersList(false);
        } else {
          showToast(res.message || 'Tạo người dùng thất bại', 'error');
          if (res.message && res.message.toLowerCase().includes('username')) {
            setErrors((prev) => ({ ...prev, username: res.message }));
          }
        }
      }
    } catch (err: any) {
      showToast('Xảy ra lỗi hệ thống', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteUser(userToDelete.id);
      if (res.success) {
        showToast(res.message || 'Xóa người dùng thành công', 'success');
        setUserToDelete(null);
        if (isModalOpen && editingUser?.id === userToDelete.id) {
          setIsModalOpen(false);
        }
        fetchUsersList(false);
      } else {
        showToast(res.message || 'Xóa người dùng thất bại', 'error');
      }
    } catch (err: any) {
      showToast('Xảy ra lỗi khi xóa người dùng', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
            <Shield size={12} className="text-purple-600" />
            Quản trị hệ thống
          </span>
        );
      case 'OFFICER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            <UserIcon size={12} className="text-blue-600" />
            Cán bộ
          </span>
        );
      case 'CITIZEN':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <UserIcon size={12} className="text-slate-500" />
            Người dân
          </span>
        );
    }
  };

  const getStatusBadge = (status?: string) => {
    const isInactive = status === 'INACTIVE';
    if (isInactive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle size={12} className="text-rose-500" />
          Ngừng hoạt động
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle size={12} className="text-emerald-500" />
        Đang hoạt động
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
              "fixed top-4 right-4 z-[100] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border backdrop-blur-md max-w-md",
              toastMessage.type === 'success' 
                ? "bg-emerald-50/95 text-emerald-800 border-emerald-200" 
                : "bg-rose-50/95 text-rose-800 border-rose-200"
            )}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle size={18} className="text-rose-600 shrink-0" />
            )}
            <p className="flex-1">{toastMessage.text}</p>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý người dùng</h1>
            <p className="text-sm font-medium text-slate-500">Quản trị danh sách tài khoản, phân quyền và trạng thái người dùng</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchUsersList(false)}
            disabled={isRefreshing || isLoading}
            className="p-2.5 text-slate-600 hover:text-brand-primary hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all flex items-center justify-center disabled:opacity-50"
            title="Làm mới danh sách"
          >
            <RefreshCw size={18} className={cn(isRefreshing && "animate-spin text-brand-primary")} />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-bold shadow-md shadow-brand-primary/20 transition-all active:scale-95 text-sm"
          >
            <UserPlus size={18} />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo Username hoặc Tên người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-auto min-w-[180px]">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full appearance-none pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all cursor-pointer"
          >
            <option value="ALL">Tất cả quyền ({users.length})</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
            <option value="OFFICER">Cán bộ (OFFICER)</option>
            <option value="CITIZEN">Người dân (CITIZEN)</option>
          </select>
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold animate-pulse text-slate-500">Đang tải danh sách người dùng...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Users size={48} className="text-slate-300 stroke-[1.5]" />
            <p className="font-bold text-slate-600 text-base">Không tìm thấy người dùng nào</p>
            <p className="text-xs text-slate-400">Thử thay đổi từ khóa tìm kiếm hoặc bấm thêm người dùng mới</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs font-black uppercase tracking-wider">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Username</th>
                  <th className="py-4 px-6">Tên người dùng</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Quyền</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">{u.id}</td>
                    <td className="py-4 px-6 font-bold text-brand-primary">
                      {u.username}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {u.fullName}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-mono">
                      {u.email || '—'}
                    </td>
                    <td className="py-4 px-6">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(u.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                          title="Sửa người dùng"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Xóa người dùng"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Dialog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                    {editingUser ? <Edit2 size={20} /> : <UserPlus size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {editingUser ? `ID: ${editingUser.id}` : 'Nhập thông tin chi tiết tài khoản mới'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Nhập tên đăng nhập..."
                      value={formData.username}
                      onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value });
                        if (errors.username) setErrors({ ...errors, username: '' });
                      }}
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:bg-white transition-all",
                        errors.username 
                          ? "border-rose-400 focus:ring-rose-200 text-rose-900" 
                          : "border-slate-200 focus:ring-brand-primary/20 focus:border-brand-primary"
                      )}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs font-bold text-rose-500 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> {errors.username}
                    </p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên người dùng..."
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:bg-white transition-all",
                      errors.fullName 
                        ? "border-rose-400 focus:ring-rose-200 text-rose-900" 
                        : "border-slate-200 focus:ring-brand-primary/20 focus:border-brand-primary"
                    )}
                  />
                  {errors.fullName && (
                    <p className="text-xs font-bold text-rose-500 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mật khẩu {!editingUser && <span className="text-rose-500">*</span>}
                    {editingUser && <span className="text-slate-400 font-normal lowercase"> (để trống nếu không đổi)</span>}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={editingUser ? "Nhập mật khẩu mới (nếu muốn thay đổi)..." : "Nhập mật khẩu..."}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      className={cn(
                        "w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:bg-white transition-all",
                        errors.password 
                          ? "border-rose-400 focus:ring-rose-200 text-rose-900" 
                          : "border-slate-200 focus:ring-brand-primary/20 focus:border-brand-primary"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-bold text-rose-500 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="ví dụ: user@gmail.com..."
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:bg-white transition-all",
                        errors.email 
                          ? "border-rose-400 focus:ring-rose-200 text-rose-900" 
                          : "border-slate-200 focus:ring-brand-primary/20 focus:border-brand-primary"
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-bold text-rose-500 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Role and Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Role Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Quyền hạn
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer transition-all"
                    >
                      <option value="ADMIN">ADMIN - Quản trị hệ thống</option>
                      <option value="OFFICER">OFFICER - Cán bộ</option>
                      <option value="CITIZEN">CITIZEN - Người dân</option>
                    </select>
                  </div>

                  {/* Status Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer transition-all"
                    >
                      <option value="ACTIVE">ACTIVE - Đang hoạt động</option>
                      <option value="INACTIVE">INACTIVE - Ngừng hoạt động</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer Action Buttons */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    {editingUser && (
                      <button
                        type="button"
                        onClick={() => setUserToDelete(editingUser)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold transition-all"
                      >
                        <Trash2 size={16} />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl text-xs font-bold shadow-md shadow-brand-primary/20 transition-all disabled:opacity-50"
                    >
                      {formLoading && <RefreshCw size={14} className="animate-spin" />}
                      <span>{editingUser ? 'Cập nhật' : 'Thêm mới'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 text-center space-y-4"
            >
              <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto">
                <AlertTriangle size={28} />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Xác nhận xóa người dùng</h3>
                <p className="text-sm font-bold text-slate-700">
                  Bạn có chắc chắn muốn xóa người dùng này?
                </p>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-left mt-3">
                  <p className="text-xs font-bold text-slate-900">{userToDelete.fullName}</p>
                  <p className="text-xs font-mono text-slate-500">Username: {userToDelete.username}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-4 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold transition-all"
                >
                  Hủy thao tác
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting && <RefreshCw size={14} className="animate-spin" />}
                  <span>Xóa</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
