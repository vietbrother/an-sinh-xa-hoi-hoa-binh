import Papa from 'papaparse';
import { SocialRecord } from '../types';
import { formatAddress } from '../lib/utils';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSdrdYekjXPY9SzlbGcf4IfFjCTjm6cLB8bfCKl20AeU5sJLYKSg7NU_9Q94NGnEHs4yhf5VZawwlKt/pub?gid=340520941&single=true&output=csv';

// Mapping table for Phuong Coordinates (GIS Mocking)
const PHUONG_COORDS: Record<string, { lat: number, lng: number }> = {
  "Phương Lâm": { lat: 20.8172, lng: 105.3377 },
  "Thịnh Lang": { lat: 20.8250, lng: 105.3400 },
  "Hoà Bình": { lat: 20.8100, lng: 105.3300 },
  "Khác": { lat: 20.8150, lng: 105.3350 }
};

export async function fetchRecordsFromSheets(): Promise<SocialRecord[]> {
  // Add a timestamp to bypass potential caching/CORS issues with stale redirects
  const urlWithCacheBust = `${SHEET_CSV_URL}&t=${new Date().getTime()}`;
  
  console.log("Fetching from Sheets:", urlWithCacheBust);
  
  return new Promise((resolve, reject) => {
    Papa.parse(urlWithCacheBust, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors && results.errors.length > 0) {
            console.error("PapaParse errors:", results.errors);
          }
          
          const rawData = results.data as any[];
          
          if (!rawData || rawData.length === 0) {
            console.warn("Sheet data is empty");
            resolve([]);
            return;
          }

          console.log(`Successfully parsed ${rawData.length} records`);

          const records: SocialRecord[] = rawData.map((row) => {
            // Mapping based on exact column names from your request
            const oldAddress = row['Địa chỉ cũ trước sáp nhập'] || "";
            const { to, phuong } = formatAddress(oldAddress);
            const coords = PHUONG_COORDS[phuong] || PHUONG_COORDS["Khác"];

            return {
              id: row['ID'] || "",
              timestamp: row['Dấu thời gian'] || "",
              fullName: row['Họ và tên'] || "",
              phone: row['Số điện thọai'] || "",
              oldAddress: oldAddress,
              col4: row['Cột 4'] || "",
              headOfHousehold: row['Họ và tên chủ hộ'] || "",
              evidenceImage: row['Vui lòng cung cấp hình ảnh minh chứng (nếu có)'] || "",
              addressStatus: row['tình trạng'] || "",
              donorAddress: row['địa chỉ nhà hảo tâm'] || "",
              birthDate: row['Ngày tháng năm sinh'] || "",
              cccd: row['Số CCCD'] || "",
              residentAddress: row['Hộ khẩu thường trú'] || "",
              familyCircumstance: row['Hoàn cảnh gia đình'] || "",
              issuedDate: row['Ngày cấp'] || "",
              supportType: row['hình thức hỗ trợ'] || "",
              col15: row['Cột 15'] || "",
              col16: row['Cột 16'] || "",
              supportHistory: row['Lịch sử hỗ trợ'] || "",
              supportNeed: row['Nhu cầu hỗ trợ'] || "",
              objectOrTypeNeed: row['đối tượng hoặc hình thức hỗ trợ'] || "",
              category: row['Đối tượng'] || "Chưa phân loại",
              processingOfficer: row['Cán bộ thực hiện'] || "",
              coordinatingUnit: row['Cá nhân hoặc Đơn vị phối hợp'] || "",
              resolutionStatus: row['Tình trạng giải quyết'] || "Mới tiếp nhận",
              result: row['Kết quả'] || "",
              completionTime: row['Thời gian hoàn thành'] || "",
              
              // GIS Computed
              to,
              phuong,
              lat: coords.lat + (Math.random() - 0.5) * 0.01,
              lng: coords.lng + (Math.random() - 0.5) * 0.01
            };
          });
          
          resolve(records);
        } catch (e) {
          console.error("Mapping error:", e);
          reject(e);
        }
      },
      error: (error: any) => {
        console.error("PapaParse Fetch Error:", error);
        reject(error);
      }
    });
  });
}
