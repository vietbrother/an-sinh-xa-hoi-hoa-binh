export type UserRole = 'ADMIN' | 'OFFICER' | 'CITIZEN';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
}

export interface SocialRecord {
  id: string;
  timestamp: string;
  fullName: string;
  phone: string;
  oldAddress: string; // Địa chỉ cũ trước sáp nhập
  col4: string; // Thường là phân loại (ĐỐI TƯỢNG CẦN HỖ TRỢ / CÁ NHÂN HẢO TÂM)
  headOfHousehold: string;
  evidenceImage?: string;
  addressStatus: string; // Tình trạng địa chỉ
  donorAddress?: string; // Địa chỉ nhà hảo tâm
  birthDate: string;
  cccd: string;
  residentAddress: string; // Hộ khẩu thường trú
  familyCircumstance: string;
  issuedDate: string;
  supportType: string; // Hình thức hỗ trợ
  col15: string;
  col16: string;
  supportHistory: string;
  supportNeed: string;
  objectOrTypeNeed: string;
  category: string; // Đối tượng
  processingOfficer?: string; // Cán bộ thực hiện
  coordinatingUnit?: string; // Đơn vị phối hợp
  resolutionStatus: string; // Tình trạng giải quyết
  result: string; // Kết quả
  completionTime?: string;
  
  // Computed fields for GIS/Stats
  to?: string;
  phuong?: string;
  lat?: number;
  lng?: number;
}
