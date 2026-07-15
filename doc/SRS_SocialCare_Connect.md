# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
## Hệ thống An sinh Xã hội Số - SocialCare Connect

---

## 1. GIỚI THIỆU (INTRODUCTION)

Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) này mô tả chi tiết các yêu cầu kỹ thuật, kiến trúc hệ thống, cấu trúc dữ liệu, các giao diện lập trình (API) và yêu cầu phi chức năng của hệ thống **SocialCare Connect**. 

Tài liệu này được biên soạn để định hướng phát triển, kiểm thử, tích hợp dữ liệu, cấu hình Google Apps Script và làm tài liệu tham chiếu kỹ thuật cho toàn bộ dự án.

---

## 2. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (SYSTEM ARCHITECTURE)

Hệ thống ứng dụng kiến trúc Web App Single Page Application (SPA) kết hợp Serverless Google Sheets API Integration đem lại tốc độ cao, giao diện tối giản mượt mà, tối ưu hóa chi phí vận hành và tính bảo mật dữ liệu.

*   **Frontend Stack:** React JS (v19), Vite (v6) làm công cụ build, Tailwind CSS (v4) thiết kế giao diện responsive và tiện ích tối đa, Motion (v12) cho các hiệu ứng chuyển động mượt mà.
*   **Trực quan hóa Dữ liệu:** Recharts (v3) hiển thị biểu đồ phân tích thống kê chuyên nghiệp; tích hợp bản đồ số GIS dựa trên tọa độ thực tế của từng Phường/Xã.
*   **Database & Integration Layer:** Google Sheets phối hợp cùng Google Apps Script (GAS) đóng vai trò là một RESTful Database Serverless. Toàn bộ thao tác CRUD (Create, Read, Update, Delete) được thực hiện thông qua giao thức HTTPS POST/GET với mã token an toàn để ngăn chặn truy cập trái phép.

---

## 3. ĐẶC TẢ DỮ LIỆU & PAYLOAD PHỐI HỢP (DATA SPECIFICATION)

Để đảm bảo tính đồng bộ tuyệt đối giữa Google Sheets và ứng dụng, cấu trúc dữ liệu của một bản ghi an sinh xã hội (`SocialRecord`) được chuẩn hóa và ánh xạ trực tiếp như sau:

| Trường dữ liệu (JSON Property) | Tiêu đề Cột trên Google Sheets | Kiểu dữ liệu | Mô tả / Định dạng dữ liệu |
| :--- | :--- | :--- | :--- |
| **id** | ID | `string` | Mã định danh duy nhất của hồ sơ (Ví dụ: `ASXH001`) |
| **headOfHousehold** | Họ và tên chủ hộ | `string` | Họ tên đầy đủ của chủ hộ gia đình khó khăn |
| **phone** | Số điện thoại / Số điện thọai | `string` | Số điện thoại chính chủ của hộ dân |
| **contactPhone** | Số điện thoại liên hệ | `string` | Số điện thoại liên lạc mới nhất do cán bộ cập nhật |
| **birthDate** | Ngày tháng năm sinh | `string` | Ngày sinh của chủ hộ (Định dạng: `DD/MM/YYYY`) |
| **cccd** | Số CCCD | `string` | Số Căn cước công dân (12 chữ số) |
| **issuedDate** | Ngày cấp | `string` | Ngày cấp CCCD (Định dạng: `DD/MM/YYYY`) |
| **category** | Là đối tượng / Đối tượng | `string` | Phân loại chính sách (Ví dụ: `Hộ nghèo`, `Hộ cận nghèo`) |
| **addressStatus** | tình trạng hỗ trợ / tình trạng | `string` | Trạng thái cư trú hoặc tình trạng chung của hộ |
| **oldAddress** | Địa chỉ cũ trước khi sáp nhập | `string` | Tên địa bàn hoặc phường cũ trước khi sáp nhập hành chính |
| **residentAddress** | Hộ khẩu thường trú hiện nay | `string` | Địa chỉ đăng ký thường trú chi tiết hiện tại |
| **familyCircumstance** | Hoàn cảnh gia đình | `string` | Mô tả chi tiết về hoàn cảnh kinh tế, khó khăn của gia đình |
| **supportNeed** | Nhu cầu hỗ trợ | `string` | Đề xuất từ người dân (Ví dụ: `Hỗ trợ tiền mặt và nhu yếu phẩm`) |
| **supportHistory** | Nhập Lịch sử hỗ trợ trước đây | `string` | Lịch sử nhận hỗ trợ cũ trước khi số hóa hệ thống |
| **supportType** | Cập nhật hình thức hỗ trợ | `string` | Hình thức cứu trợ chính (Ví dụ: `Hỗ trợ tiền mặt 2 triệu`) |
| **supportHistoryLast** | Cập nhật Lịch sử hỗ trợ | `string` | Nhật ký cập nhật hỗ trợ mới được lưu dưới dạng chuỗi có cấu trúc |
| **processingOfficer** | Cán bộ thực hiện | `string` | Họ tên cán bộ phụ trách xử lý trực tiếp |
| **coordinatingUnit** | Cập nhật Cá nhân hoặc Đơn vị phối hợp | `string` | Đơn vị phối hợp cứu trợ (Ví dụ: `UBND Phường Hoàn Kiếm`) |
| **updatedSupportStatus** | Cập nhật tình trạng hỗ trợ | `string` | Trạng thái cụ thể trong quá trình hỗ trợ (Ví dụ: `Đã tiếp nhận`) |
| **resolutionStatus** | Cập nhật tình trạng giải quyết | `string` | Trạng thái tiến độ lớn (Ví dụ: `Mới tiếp nhận`, `Đang xử lý`, `Hoàn thành`) |
| **result** | Cập nhật Kết quả xử lý | `string` | Kết quả sau khi kết thúc đợt cứu trợ (Ví dụ: `Đã hỗ trợ thành công`) |
| **completionTime** | Thời gian hoàn thành | `string` | Thời gian ghi nhận hoàn thành hồ sơ hỗ trợ |

---

## 4. ĐẶC TẢ CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### 4.1. Hệ thống Xác thực & Phân quyền Người dùng (Auth & Authorization)
Hệ thống quản lý phiên đăng nhập tại React sử dụng Context API (`AuthContext.tsx`) và lưu trạng thái vào `localStorage` để tránh mất phiên khi người dùng làm mới trình duyệt.

*   **Tài khoản Quản trị viên (ADMIN):**
    *   Mật khẩu đăng nhập: `MttqHoaBinh@2026@admin`
    *   Quyền hạn: Toàn quyền cập nhật tất cả dữ liệu, chỉnh sửa các trường cấu trúc hệ thống, xem toàn quyền Dashboard báo cáo nâng cao.
*   **Tài khoản Cán bộ (OFFICER):**
    *   Mật khẩu đăng nhập: `MttqHoaBinh@2026@canbo` hoặc `1234` (dành cho các cán bộ phụ trợ).
    *   Quyền hạn: Khảo sát và cập nhật thông tin xử lý thực tế của hồ sơ.
    *   Hạn chế: Hệ thống tự động ẩn hoặc khóa trường dữ liệu nhạy cảm là *Tình trạng hỗ trợ* (hoặc *tình trạng*) khi tài khoản OFFICER đăng nhập, đảm bảo không có sự sai sót hoặc thay đổi hành chính trái quy định.
*   **Tài khoản Người dân / Nhà hảo tâm (CITIZEN):**
    *   Mật khẩu đăng nhập: `123`
    *   Quyền hạn: Chỉ có quyền xem dữ liệu và định vị trên bản đồ (Read-Only).

### 4.2. Giao diện Lập trình & Kết nối Google Sheets (API Integration Flow)
Giao tiếp giữa Web App và Google Sheets được thiết kế bất đồng bộ qua hai con đường riêng biệt để đạt hiệu suất cao nhất:

1.  **Đọc dữ liệu nhanh (Read Flow):**
    *   Ứng dụng sử dụng thư viện `PapaParse` để tải và chuyển đổi dữ liệu dạng CSV từ liên kết Google Sheets đã được xuất bản công khai (Publish to the Web).
    *   Phương pháp này giúp tăng tốc độ phản hồi tải trang dưới 1.5 giây, giảm tải hoàn toàn cho hệ thống API Google Cloud và loại bỏ hoàn toàn các lỗi chặn tên miền (CORS).
2.  **Ghi dữ liệu bảo mật (Write Flow):**
    *   Khi cán bộ nhấn "Lưu cập nhật", ứng dụng gửi một yêu cầu HTTP POST đến địa chỉ URL Web App của Google Apps Script (`YOUR_GAS_URL`).
    *   Payload gửi đi bao gồm đầy đủ dữ liệu cập nhật dưới dạng JSON cùng mã Token bảo mật (`AnSinhXaHoi@2026`). Google Apps Script nhận yêu cầu, xác thực Token, dò tìm dòng chứa ID bản ghi thích hợp trên trang tính và ghi đè dữ liệu lên các cột chính xác tương ứng.

### 4.3. Giải thuật Bản đồ GIS & Định vị địa giới
Do địa chỉ cũ trước khi sáp nhập thường không có tọa độ vĩ độ/kinh độ chính xác trên bản đồ Google Maps mặc định, hệ thống phát triển bộ lọc phân tích cú pháp địa lý cục bộ (Local Address Parsing Engine):
*   Hệ thống bóc tách từ trường `oldAddress` (Địa chỉ cũ trước khi sáp nhập) để tìm ra các từ khóa địa danh lịch sử (như: *Phương Lâm, Thịnh Lang, Hồng Hà, Đồng Tiến, Hữu Nghị*...).
*   Ánh xạ tên địa danh lịch sử này vào bảng cơ sở dữ liệu tọa độ trung tâm được thiết lập sẵn trong hệ thống.
*   **Giải thuật Jittering:** Để tránh tình trạng hàng loạt điểm hồ gia đình thuộc cùng một phường cũ bị vẽ đè lên nhau tại một điểm duy nhất trên bản đồ, hệ thống tự động cộng thêm một sai số ngẫu nhiên cực nhỏ (Random Jitter) vào vĩ độ và kinh độ:
    $$\text{Latitude}_{\text{new}} = \text{Latitude}_{\text{base}} + (\text{Math.random()} - 0.5) \times 0.01$$
    $$\text{Longitude}_{\text{new}} = \text{Longitude}_{\text{base}} + (\text{Math.random()} - 0.5) \times 0.01$$
    Điều này giúp phân tán các chấm định vị đồng đều trên bản đồ điểm, thể hiện một cách trung thực và đẹp mắt mật độ khó khăn tại từng địa bàn.

### 4.4. Giải thuật Phân tích Timeline Lịch sử Hỗ trợ
Trường dữ liệu `supportHistoryNew` (Lịch sử hỗ trợ mới thực hiện) lưu nhật ký hỗ trợ dưới dạng chuỗi văn bản thuần có cấu trúc để tiết kiệm không gian lưu trữ và đảm bảo tính đồng bộ trên Google Sheets. Cấu trúc chuẩn hóa:
`[Ngày cập nhật] Nội dung công việc cập nhật`

Tại RecordsModal, hệ thống áp dụng giải thuật phân tích chuỗi nâng cao:
1.  Sử dụng biểu thức chính quy (Regex) `\n(?=\[)` để tách chuỗi nhật ký lớn thành một mảng các sự kiện nhỏ riêng biệt, dựa trên ký tự xuống dòng đi liền trước dấu mở ngoặc vuông của mốc ngày tháng.
2.  Với mỗi sự kiện, hệ thống tiếp tục bóc tách thành mốc thời gian (trong ngoặc vuông) và nội dung xử lý (đứng sau).
3.  Dựng giao diện Timeline động theo chiều dọc với các nút chỉ thị màu xanh và đường nối liền mạch, giúp người dùng dễ dàng theo dõi toàn bộ diễn biến hỗ trợ từ cũ nhất đến mới nhất một cách chuyên nghiệp.

---

## 5. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

*   **Tính di động và Đáp ứng (Responsive):** 100% các nút bấm, ô nhập liệu, bảng biểu được tối ưu hóa cho màn hình cảm ứng di động (Mobile Web) giúp cán bộ dễ dàng thao tác tại thực địa qua điện thoại 3G/4G.
*   **Tốc độ xử lý:** Thời gian tải dữ liệu thô và dựng Dashboard báo cáo không vượt quá 2 giây trên đường truyền mạng thông thường.
*   **Độ tin cậy cao:** Có cơ chế bắt lỗi ngoại lệ (Exception Handling). Khi có sự cố mất kết nối mạng trong lúc lưu hồ sơ, hệ thống sẽ hiển thị thông báo lỗi chi tiết, đồng thời giữ nguyên dữ liệu trong form để tránh việc cán bộ phải nhập lại từ đầu.
