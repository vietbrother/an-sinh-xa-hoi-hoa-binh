# GIỚI THIỆU ỨNG DỤNG & HƯỚNG DẪN SỬ DỤNG
## Hệ thống An sinh Xã hội Số - SocialCare Connect

---

## 1. GIỚI THIỆU CHUNG (APPLICATION INTRODUCTION)

**SocialCare Connect** là Hệ thống An sinh Xã hội Số thông minh được thiết kế nhằm hỗ trợ chính quyền địa phương, Ủy ban Mặt trận Tổ quốc và các tổ chức đoàn thể xã hội số hóa toàn diện quy trình khảo sát, quản lý và phân bổ nguồn lực cứu trợ.

Hệ thống kết hợp sức mạnh của một ứng dụng Web hiện đại, mượt mà trên nền tảng React và sự linh hoạt, dễ sử dụng của cơ sở dữ liệu Google Sheets. Qua đó giúp theo dõi sát sao hoàn cảnh, nhu cầu thực tế và lịch trình nhận hỗ trợ của từng hộ gia đình khó khăn trên địa bàn, đảm bảo công tác an sinh xã hội luôn diễn ra kịp thời, đúng đối tượng và minh bạch nhất.

---

## 2. QUY TRÌNH NGHIỆP VỤ AN SINH XÃ HỘI

Quy trình hoạt động của SocialCare Connect được chuẩn hóa qua 4 giai đoạn khép kín:

```
[Người dân gửi nhu cầu] 
        │
        ▼
[Cán bộ tiếp nhận & Khảo sát thực địa] 
        │
        ▼
[Liên kết Đơn vị phối hợp & Trao quà] 
        │
        ▼
[Cập nhật Kết quả & Lưu nhật ký Timeline]
```

1.  **Tiếp nhận nhu cầu:** Thông tin về các hộ khó khăn hoặc nhu cầu cứu trợ khẩn cấp được ghi nhận trực tiếp vào tệp Google Sheets thông qua các biểu mẫu (Form) khảo sát trực tuyến.
2.  **Khảo sát địa bàn:** Cán bộ thực địa đăng nhập vào ứng dụng, lọc danh sách các hộ mới tiếp nhận, trực tiếp xuống địa bàn để xác minh thông tin nhân khẩu và nhu cầu thực tế.
3.  **Điều phối hỗ trợ:** Cán bộ cập nhật số điện thoại liên hệ mới, ghi nhận hoàn cảnh khó khăn thực tế, gán đơn vị phối hợp đồng hành (Hội Mặt trận Tổ quốc, Hội Chữ thập đỏ, tổ chức từ thiện, nhà hảo tâm...) và lựa chọn hình thức trao quà thích hợp.
4.  **Hoàn thành & Lưu nhật ký:** Khi hỗ trợ được trao tận tay người dân, cán bộ cập nhật trạng thái "Hoàn thành" và ghi nhận lịch sử vào hệ thống Timeline. Dữ liệu này lập tức đồng bộ thời gian thực về Google Sheets và cập nhật tức thì lên các biểu đồ thống kê trên Dashboard.

---

## 3. HƯỚNG DẪN SỬ DỤNG CHI TIẾT THEO VAI TRÒ

### 3.1. Dành cho Người dân & Nhà hảo tâm (Chế độ Xem công khai)
Mọi người dân và nhà hảo tâm đều có thể truy cập hệ thống công khai để thực hiện tra cứu:
*   **Tìm kiếm thông tin hộ gia đình:** Truy cập vào menu **Hồ sơ an sinh**, nhập Họ tên chủ hộ, Số điện thoại hoặc Số căn cước công dân vào thanh tìm kiếm để kiểm tra thông tin cứu trợ của hộ mình.
*   **Bản đồ định vị cứu trợ:** Xem trực tiếp bản đồ an sinh để biết mật độ phân bổ các đối tượng khó khăn trên địa bàn, từ đó điều hướng và phân bổ các nguồn lực tài trợ, cứu trợ một cách hợp lý và hiệu quả nhất.

### 3.2. Dành cho Cán bộ địa bàn (OFFICER)
Cán bộ thực địa sử dụng hệ thống để trực tiếp xử lý các hồ sơ hỗ trợ trên địa bàn:
1.  **Đăng nhập hệ thống:** Nhấn vào nút **Đăng nhập** ở góc trên cùng bên phải, nhập mật khẩu cán bộ: `MttqHoaBinh@2026@canbo` (hoặc `1234` nếu được cấp tài khoản phụ trợ).
2.  **Tìm kiếm & Sắp xếp:** Sử dụng bộ lọc theo **Trạng thái giải quyết** để lọc ra các hộ ở trạng thái *Mới tiếp nhận* hoặc *Đang xử lý* để tiến hành khảo sát và hỗ trợ gấp.
3.  **Cập nhật thông tin thực tế:** Nhấn vào nút **Xử lý** trên thẻ hộ dân cần hỗ trợ để mở hộp thoại cập nhật chi tiết.
    *   Cập nhật *Số điện thoại liên hệ thực tế* của gia đình.
    *   Bổ sung mô tả *Hoàn cảnh gia đình* và *Nhu cầu hỗ trợ* thực tế của người dân sau khi khảo sát thực địa.
    *   Nhập tên *Cán bộ chịu trách nhiệm* trực tiếp xử lý.
4.  **Cập nhật Nhật ký Timeline hỗ trợ:**
    *   Tại trường **Lịch sử hỗ trợ mới thực hiện**, nhập thông tin theo đúng định dạng chuẩn: `[Ngày] Nội dung chi tiết công việc` (Ví dụ: `[14/07/2026] Đã xuống trao tặng 1 tấn gạo từ quỹ Chữ thập đỏ phường`).
    *   Chọn hình thức hỗ trợ tương ứng và cập nhật trạng thái tiến độ giải quyết (ví dụ: chuyển từ *Đang xử lý* sang *Hoàn thành*).
    *   Nhấn **Lưu cập nhật** để ghi dữ liệu trực tiếp lên trang tính Google Sheets.

### 3.3. Dành cho Quản trị viên hệ thống (ADMIN)
Quản trị viên sử dụng tài khoản để kiểm soát và quản lý toàn diện dòng công việc:
1.  **Đăng nhập hệ thống:** Nhấn nút **Đăng nhập** và sử dụng mật khẩu admin: `MttqHoaBinh@2026@admin`.
2.  **Theo dõi Dashboard Phân tích chuyên sâu:**
    *   Giám sát trực quan các biểu đồ thống kê mức độ đóng góp của từng đơn vị phối hợp (Mặt trận Tổ quốc, Hội Chữ thập đỏ, UBND, Doanh nghiệp...).
    *   Theo dõi tỷ lệ hồ sơ đã được hoàn thành cứu trợ và thời gian giải quyết trung bình của toàn hệ thống.
3.  **Bảo vệ dữ liệu gốc:** Kiểm soát trường thông tin nhạy cảm là *Tình trạng hộ gia đình/Địa bàn cư trú* để tránh việc cán bộ địa bàn tự ý sửa đổi khi chưa được cấp phép hành chính.

---

## 4. HƯỚNG DẪN TÍCH HỢP GOOGLE SHEETS & GOOGLE APPS SCRIPT

Để vận hành hệ thống với tệp Google Sheets mới của đơn vị, thực hiện theo các bước sau:

### Bước 1: Tạo tệp Google Sheets
Tạo một tệp Google Sheets mới và thiết lập dòng tiêu đề đầu tiên chứa chính xác các cột sau (tính từ cột A):
`ID`, `Họ và tên chủ hộ`, `Số điện thoại / Số điện thọai`, `Số điện thoại liên hệ`, `Ngày tháng năm sinh`, `Số CCCD`, `Ngày cấp`, `Là đối tượng / Đối tượng`, `tình trạng hỗ trợ / tình trạng`, `Địa chỉ cũ trước khi sáp nhập`, `Hộ khẩu thường trú hiện nay`, `Hoàn cảnh gia đình`, `Nhu cầu hỗ trợ`, `Nhập Lịch sử hỗ trợ trước đây`, `Cập nhật hình thức hỗ trợ`, `Cập nhật Lịch sử hỗ trợ`, `Cán bộ thực hiện`, `Cập nhật Cá nhân hoặc Đơn vị phối hợp`, `Cập nhật tình trạng hỗ trợ`, `Cập nhật tình trạng giải quyết`, `Cập nhật Kết quả xử lý`, `Thời gian hoàn thành`.

### Bước 2: Triển khai Google Apps Script (GAS)
1.  Trên tệp Google Sheets, chọn **Tiện ích mở rộng** -> **Apps Script**.
2.  Dán đoạn mã dưới đây vào trình soạn thảo và nhấn lưu lại:

```javascript
// CẤU HÌNH TOKEN BẢO MẬT
var SECURITY_TOKEN = "";

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);
    
    // Kiểm tra Token bảo mật
    if (payload.token !== SECURITY_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        message: "Mã bảo mật không hợp lệ!" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var data = sheet.getDataRange().getValues();
    
    // Tìm kiếm dòng dữ liệu dựa vào mã ID
    var idToFind = payload.id;
    var targetRow = -1;
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString() === idToFind.toString()) {
        targetRow = i + 1; // Số thứ tự dòng thực tế trong Sheets
        break;
      }
    }
    
    if (targetRow === -1) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        message: "Không tìm thấy hồ sơ có ID tương ứng!" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Tiến hành ghi các trường thông tin cập nhật mới
    sheet.getRange(targetRow, 4).setValue(payload.contactPhone); // SĐT liên hệ mới
    sheet.getRange(targetRow, 11).setValue(payload.residentAddress); // Hộ khẩu thường trú
    sheet.getRange(targetRow, 12).setValue(payload.familyCircumstance); // Hoàn cảnh gia đình
    sheet.getRange(targetRow, 13).setValue(payload.supportNeed); // Nhu cầu hỗ trợ
    sheet.getRange(targetRow, 15).setValue(payload.supportType); // Hình thức hỗ trợ
    sheet.getRange(targetRow, 16).setValue(payload.supportHistoryNew); // Lịch sử hỗ trợ mới (Timeline)
    sheet.getRange(targetRow, 17).setValue(payload.processingOfficer); // Cán bộ thực hiện
    sheet.getRange(targetRow, 18).setValue(payload.coordinatingUnit); // Đơn vị phối hợp
    sheet.getRange(targetRow, 19).setValue(payload.updatedSupportStatus); // Tình trạng hỗ trợ chi tiết
    sheet.getRange(targetRow, 20).setValue(payload.resolutionStatus); // Tiến độ giải quyết lớn
    sheet.getRange(targetRow, 21).setValue(payload.result); // Kết quả xử lý
    sheet.getRange(targetRow, 22).setValue(new Date().toLocaleString("vi-VN")); // Thời gian hoàn thành
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: "Cập nhật và đồng bộ dữ liệu thành công!" 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      message: "Lỗi hệ thống: " + error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Bước 3: Phát hành Web App Google Apps Script
1.  Tại góc trên bên phải trình duyệt Apps Script, nhấn **Triển khai** (Deploy) -> **Triển khai mới** (New deployment).
2.  Chọn loại cấu hình triển khai là **Ứng dụng web** (Web app).
3.  Cấu hình tham số:
    *   *Mô tả:* `SocialCare Connect Sync Server`
    *   *Thực thi dưới quyền (Execute as):* **Tôi** (Me)
    *   *Ai có quyền truy cập (Who has access):* **Bất kỳ ai** (Anyone)
4.  Nhấn nút **Triển khai**. Cấp các quyền bảo mật truy cập nếu được Google yêu cầu.
5.  Sao chép đoạn mã liên kết ứng dụng web được cấp (URL Web App).

### Bước 4: Cấu hình địa chỉ URL trong mã nguồn ứng dụng
Mở file nguồn `/src/services/dataService.ts` hoặc `/src/pages/RecordsList.tsx` trên ứng dụng của bạn, dán liên kết URL Web App vừa sao chép vào hằng số cấu hình hệ thống:
`const YOUR_GAS_URL = "DÁN_URL_WEB_APP_VÀO_ĐÂY";`
Nhấn lưu lại để kích hoạt hệ thống đồng bộ dữ liệu thời gian thực.
