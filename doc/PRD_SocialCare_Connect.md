# TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD)
## Hệ thống An sinh Xã hội Số - SocialCare Connect

---

## 1. GIỚI THIỆU DỰ ÁN (PROJECT OVERVIEW)

**SocialCare Connect** là hệ thống quản lý an sinh xã hội số toàn diện được xây dựng nhằm chuyển đổi số công tác tiếp nhận, quản lý, phân bổ nguồn lực cứu trợ và giám sát tiến độ hỗ trợ cho các đối tượng chính sách, hộ nghèo, hộ cận nghèo và các gia đình có hoàn cảnh đặc biệt khó khăn tại địa phương.

Hệ thống giải quyết triệt để bài toán phức tạp về xáo trộn địa giới hành chính sau khi sáp nhập các phường/xã cũ thành đơn vị hành chính mới. Bằng cách kết nối trực tiếp cán bộ mặt trận, các nhà hảo tâm và chính quyền địa phương trên một nền tảng đồng bộ dữ liệu thời gian thực, SocialCare Connect đảm bảo tiêu chí hỗ trợ cứu trợ: **Đúng đối tượng - Đúng nhu cầu - Kịp thời - Minh bạch**.

---

## 2. BỐI CẢNH & THÁCH THỨC THỰC TIỄN

Trước khi áp dụng công nghệ số, công tác quản lý an sinh xã hội đối mặt với nhiều rào cản lớn:
*   **Xáo trộn địa giới hành chính:** Việc sáp nhập các phường cũ thành phường mới (ví dụ: các tổ dân phố của các phường cũ sáp nhập vào phường mới) làm thất lạc hoặc sai lệch thông tin địa bàn, khiến việc định vị và quản lý địa bàn cư trú của hộ gia đình cực kỳ khó khăn nếu chỉ lưu trữ bằng sổ sách giấy hoặc file Excel độc lập.
*   **Trùng lặp và phân tán thông tin:** Thiếu hệ thống quản lý tập trung dẫn đến tình trạng một hộ gia đình khó khăn có thể nhận hỗ trợ nhiều lần từ các tổ chức/nhà hảo tâm khác nhau, trong khi các hộ khó khăn thực tế khác lại bị bỏ sót hoặc không tiếp cận được nguồn lực cứu trợ.
*   **Thiếu công cụ trực quan hóa (GIS):** Cán bộ lãnh đạo và các đoàn cứu trợ không có góc nhìn tổng quát trực quan về mật độ phân bổ các hộ nghèo/cận nghèo trên bản đồ số để điều phối nguồn lực, dẫn đến phân bổ nguồn lực không đồng đều giữa các khu vực dân cư.
*   **Quy trình xác minh và cập nhật chậm trễ:** Quy trình từ khi tiếp nhận phản ánh nhu cầu của người dân đến khi cử cán bộ xuống xác minh, liên kết đơn vị phối hợp hỗ trợ, thực hiện trao quà và ghi nhận kết quả chưa được số hóa, dẫn đến khó kiểm tra tiến độ và trách nhiệm giải trình.

---

## 3. MỤC TIÊU CỐT LÕI CỦA SẢN PHẨM

Hệ thống hướng tới việc xây dựng một quy trình khép kín, minh bạch và ứng dụng công nghệ hiện đại:
1.  **Số hóa 100% hồ sơ an sinh xã hội:** Tất cả hồ sơ cứu trợ, thông tin nhân khẩu và nhu cầu được lưu trữ tập trung, bảo mật và tra cứu nhanh chóng.
2.  **Đồng bộ hóa 2 chiều thời gian thực:** Kết nối trực tiếp với Google Sheets làm cơ sở dữ liệu nền thông qua Google Apps Script bảo mật, vừa tối ưu hóa chi phí vận hành vừa đem lại tính dễ sử dụng tối đa cho cán bộ địa phương.
3.  **Trực quan hóa Bản đồ số GIS:** Tự động định vị, phân tích địa chỉ cũ trước sáp nhập để đưa ra tọa độ địa lý, hiển thị mật độ phân bổ hộ khó khăn trực quan trên bản đồ nhiệt (Heatmap) hoặc bản đồ điểm (Marker).
4.  **Tích hợp Nhật ký Timeline thông minh:** Số hóa toàn bộ nhật ký hỗ trợ mới nhất dưới dạng dòng thời gian (Timeline) chuyên nghiệp để dễ dàng theo dõi chi tiết tiến trình hỗ trợ từ lúc tiếp nhận đến khi hoàn tất.

---

## 4. ĐỐI TƯỢNG SỬ DỤNG & PHÂN QUYỀN (USER PERSONAS)

SocialCare Connect được thiết kế tối ưu hóa giao diện và tính năng cho 3 nhóm người dùng chính:

### A. Quản trị viên hệ thống (ADMIN)
*   **Vai trò:** Cán bộ lãnh đạo Ủy ban Mặt trận Tổ quốc hoặc cơ quan quản lý nhà nước phụ trách an sinh xã hội tại địa bàn.
*   **Quyền hạn:** 
    *   Toàn quyền truy cập và kiểm tra tất cả các chức năng của hệ thống.
    *   Theo dõi toàn diện các biểu đồ thống kê chuyên sâu trên Dashboard phân tích.
    *   Sửa đổi, cấu hình các thông tin hệ thống nhạy cảm như *Tình trạng hộ gia đình/Tình trạng hỗ trợ cư trú* (để đảm bảo tính toàn vẹn của dữ liệu gốc).
    *   Kiểm tra hiệu suất công việc của từng cán bộ thực hiện và sự phối hợp của các đơn vị.

### B. Cán bộ thực hiện (OFFICER)
*   **Vai trò:** Cán bộ mặt trận, tổ trưởng dân phố hoặc tình nguyện viên trực tiếp phụ trách khảo sát và hỗ trợ hộ dân tại địa bàn.
*   **Quyền hạn:** 
    *   Xem danh sách hồ sơ hộ gia đình khó khăn trên địa bàn phụ trách.
    *   Tìm kiếm, lọc nâng cao theo địa bàn phường cũ/mới và tình trạng giải quyết.
    *   Sử dụng form nghiệp vụ để cập nhật thông tin khảo sát thực tế (SĐT liên hệ, Hoàn cảnh gia đình, Nhu cầu hỗ trợ, Cán bộ chịu trách nhiệm, Đơn vị phối hợp, Tình trạng giải quyết và Kết quả cụ thể).
    *   **Giới hạn:** Bị khóa các trường dữ liệu mang tính phân loại hệ thống (như *Tình trạng hỗ trợ*) để tránh việc cán bộ tự ý thay đổi dữ liệu hành chính khi chưa được phê duyệt.

### C. Người dân / Nhà hảo tâm (CITIZEN / DONOR)
*   **Vai trò:** Người dân sống trên địa bàn hoặc đại diện các cơ quan, tổ chức, nhà hảo tâm muốn cứu trợ.
*   **Quyền hạn:**
    *   Tra cứu công khai thông tin hồ sơ an sinh của hộ gia đình mình bằng Số điện thoại, CCCD hoặc Họ tên để đảm bảo tính minh bạch.
    *   Xem bản đồ phân bổ an sinh để nắm bắt các khu vực nghèo khó, hỗ trợ việc điều hướng nguồn lực cứu trợ phù hợp.
    *   **Giới hạn:** Chỉ có quyền xem dữ liệu (Read-Only), hoàn toàn không thể chỉnh sửa dữ liệu trên hệ thống.

---

## 5. YÊU CẦU TÍNH NĂNG CỐT LÕI (CORE REQUIREMENTS)

### 5.1. Bảng điều khiển phân tích thông minh (Dashboard)
*   **Chỉ số tổng hợp (Key Metrics):** Tổng số hồ sơ, số hồ sơ đang xử lý, số hồ sơ đã hoàn thành, tỷ lệ hoàn thành (%), thời gian xử lý trung bình.
*   **Biểu đồ trực quan hóa:**
    *   Biểu đồ cột phân bổ đối tượng khó khăn theo địa bàn Phường cũ để hỗ trợ công tác so sánh mức độ phân bổ trước sáp nhập.
    *   Biểu đồ tròn (Pie Chart) thể hiện trực quan tỷ lệ giải quyết hồ sơ cứu trợ.
    *   Biểu đồ tiến độ và trạng thái hỗ trợ thực tế của các hộ gia đình.
*   **Nhật ký cập nhật mới:** Danh sách hiển thị trực tiếp các cập nhật hỗ trợ mới nhất từ cán bộ thực địa, liên kết trực quan với thông tin của từng hộ dân.

### 5.2. Quản lý Danh sách Hồ sơ (Records List)
*   **Tìm kiếm đa năng:** Hỗ trợ tìm kiếm thời gian thực theo nhiều tiêu chí đồng thời (Họ tên chủ hộ, Số điện thoại, CCCD, Địa chỉ cũ).
*   **Bộ lọc thông minh:** 
    *   Lọc theo Phân loại đối tượng: Hộ nghèo, Cận nghèo, Khó khăn đột xuất...
    *   Lọc theo Trạng thái giải quyết: Mới tiếp nhận, Đang xử lý, Hoàn thành.
    *   Lọc theo Tổ dân phố hoặc địa giới hành chính Phường cũ.
*   **Giao diện trực quan:** Thẻ hồ sơ được thiết kế tinh tế, sử dụng các dải màu (Badge) tương ứng với trạng thái để tăng tốc độ phân loại bằng mắt thường cho cán bộ.

### 5.3. Quy trình Xử lý & Nhật ký Timeline (Records Modal & Timeline)
*   **Form chi tiết hồ sơ:** Hiển thị thông tin nhân khẩu chi tiết, lịch sử cứu trợ cũ để tránh tình trạng trùng lặp nguồn lực.
*   **Cập nhật tiến độ nghiệp vụ:** Cho phép cập nhật thông tin khảo sát, gán cán bộ phụ trách, liên kết đơn vị đồng hành (UBND Phường, Hội Chữ thập đỏ, Mặt trận Tổ quốc...).
*   **Hệ thống Timeline lịch sử mới:**
    *   Hiển thị dòng thời gian dọc (Vertical Timeline) của tất cả các hoạt động hỗ trợ mới được thực hiện.
    *   Mỗi hoạt động hỗ trợ được chuẩn hóa bằng thẻ thời gian và nội dung rõ ràng, tự động bóc tách từ trường dữ liệu đồng bộ với Google Sheets.

---

## 6. CHỈ SỐ THÀNH CÔNG (KEY PERFORMANCE INDICATORS - KPIs)

*   **Tính toàn vẹn dữ liệu:** 100% các cập nhật của cán bộ trên ứng dụng di động/máy tính được đồng bộ chính xác và tức thời lên Google Sheets gốc.
*   **Hiệu suất xử lý công việc:** Rút ngắn tối thiểu 40% thời gian điều phối, xác minh và trao quà cứu trợ nhờ quy trình liên kết đơn vị phối hợp trực quan và giám sát trạng thái thời gian thực.
*   **Mức độ hài lòng & Dễ tiếp cận:** Cán bộ địa bàn không cần am hiểu sâu về công nghệ thông tin vẫn có thể dễ dàng sử dụng ứng dụng để cập nhật tiến độ chỉ sau 10 phút hướng dẫn.
