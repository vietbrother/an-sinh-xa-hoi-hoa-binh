import { User, SocialRecord } from '../types';
import { formatAddress } from '../lib/utils';

export const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', fullName: 'Quản trị viên Hệ thống', role: 'ADMIN', password: 'MttqHoaBinh@2026@admin' },
  { id: '2', username: 'canbo', fullName: 'Nguyễn Văn A', role: 'OFFICER', password: 'MttqHoaBinh@2026@canbo' },
  { id: '3', username: 'dan', fullName: 'Trần Văn Dân', role: 'CITIZEN', password: '123' },
];

export const MOCK_RECORDS_RAW = [
  {
    id: "HS0000000004",
    timestamp: "10/05/2026 18:51:25",
    fullName: "Trần Khai Hộ",
    phone: "0986123456",
    oldAddress: "Tổ 10, phường Phương Lâm",
    col4: "ĐỐI TƯỢNG CẦN HỖ TRỢ",
    headOfHousehold: "Phạm Văn B",
    evidenceImage: "",
    addressStatus: "Khẩn cấp",
    donorAddress: "",
    birthDate: "01/01/1960",
    cccd: "017123456789",
    residentAddress: "Tổ 1, phường Hoà Bình",
    familyCircumstance: "Bị tai nạn, mất khả năng lao động. Vợ không có việc làm ổn định, nuôi 2 con ăn học",
    issuedDate: "01/12/2021",
    supportType: "",
    col15: "",
    col16: "",
    supportHistory: "Đã được Hội PN tặng quà trị giá 1.000.000đ tiền mặt",
    supportNeed: "Sửa chữa nhà ở do bị xuống cấp nghiêm trọng",
    objectOrTypeNeed: "",
    category: "Hộ nghèo",
    processingOfficer: "Nguyễn Văn A",
    coordinatingUnit: "",
    resolutionStatus: "Đang xử lý",
    result: "Đã tiếp nhận",
    completionTime: "2026-05-10 20:27:47"
  },
  {
    id: "HS0000000005",
    timestamp: "10/05/2026 18:52:51",
    fullName: "Phạm Thị Hai",
    phone: "0912345678",
    oldAddress: "Tổ 2, phường Thịnh Lang",
    col4: "CÁ NHÂN, DOANH NGHIỆP, ĐƠN VỊ HẢO TÂM",
    headOfHousehold: "",
    evidenceImage: "",
    addressStatus: "",
    donorAddress: "Công ty X, phường Hoà Bình",
    birthDate: "",
    cccd: "",
    residentAddress: "",
    familyCircumstance: "",
    issuedDate: "",
    supportType: "Tiền mặt trị giá 10.000.000đ",
    col15: "",
    col16: "",
    supportHistory: "",
    supportNeed: "",
    objectOrTypeNeed: "",
    category: "Nhà hảo tâm",
    processingOfficer: "",
    coordinatingUnit: "",
    resolutionStatus: "Hoàn thành",
    result: "Đã ủng hộ",
    completionTime: "2026-05-11 08:00:00"
  },
  {
    id: "HS0000000006",
    timestamp: "11/05/2026 09:15:25",
    fullName: "Lê Văn Cường",
    phone: "0977665544",
    oldAddress: "Tổ 5, phường Hoà Bình",
    col4: "ĐỐI TƯỢNG CẦN HỖ TRỢ",
    headOfHousehold: "Lê Văn Cường",
    evidenceImage: "",
    addressStatus: "Bình thường",
    donorAddress: "",
    birthDate: "15/05/1975",
    cccd: "017987654321",
    residentAddress: "Tổ 5, phường Hoà Bình",
    familyCircumstance: "Bệnh tật hiểm nghèo, neo đơn",
    issuedDate: "10/10/2022",
    supportType: "Nhu yếu phẩm",
    col15: "",
    col16: "",
    supportHistory: "Đã nhận quà tết 2025",
    supportNeed: "Chi phí khám chữa bệnh",
    objectOrTypeNeed: "",
    category: "Bệnh hiểm nghèo",
    processingOfficer: "Nguyễn Văn A",
    coordinatingUnit: "Trạm y tế phường",
    resolutionStatus: "Kiểm tra hồ sơ",
    result: "Đang xác minh",
    completionTime: ""
  }
];

// Helper to add GIS info for demo
const PHUONG_COORDS: Record<string, { lat: number, lng: number }> = {
  "Phương Lâm": { lat: 20.8172, lng: 105.3377 },
  "Thịnh Lang": { lat: 20.8250, lng: 105.3400 },
  "Hoà Bình": { lat: 20.8100, lng: 105.3300 },
  "Khác": { lat: 20.8150, lng: 105.3350 }
};

export const MOCK_RECORDS: SocialRecord[] = MOCK_RECORDS_RAW.map(r => {
  const { to, phuong } = formatAddress(r.oldAddress);
  const coords = PHUONG_COORDS[phuong] || PHUONG_COORDS["Khác"];
  
  return {
    ...r,
    to,
    phuong,
    // Add bit of randomness for visual map spread
    lat: coords.lat + (Math.random() - 0.5) * 0.01,
    lng: coords.lng + (Math.random() - 0.5) * 0.01
  };
});
