# TÀI LIỆU THIẾT KẾ MỨC CHI TIẾT (LOW-LEVEL DESIGN - LLD)
## HỆ THỐNG AN SINH XÃ HỘI SỐ - SOCIALCARE CONNECT
**Phiên bản:** 2.4.0  
**Tác giả:** Đội ngũ Kỹ thuật & Chuyển đổi số MTTQ Việt Nam  
**Ngày cập nhật:** 2026  
**Mục đích:** Đặc tả chi tiết toàn bộ màn hình, thành phần giao diện (Components), cấu trúc trường dữ liệu (Data Schema), quy tắc nghiệp vụ (Business Rules), luồng xử lý (Workflows), và đặc tả API Contracts để phục vụ tái thiết kế hoặc triển khai lại trên nền tảng Backend/Frontend mới (PostgreSQL, NestJS, Go, Next.js, Flutter, Spring Boot...).

---

## MỤC LỤC
1. [TỔNG QUAN HỆ THỐNG & KIẾN TRÚC MỨC THẤP](#1-tổng-quan-hệ-thống--kiến-trúc-mức-thấp)
2. [QUẢN LÝ TRẠNG THÁI & PHÂN QUYỀN (STATE & RBAC)](#2-quản-lý-trạng-thái--phân-quyền-state--rbac)
3. [ĐẶC TẢ CHI TIẾT CÁC MÀN HÌNH (SCREENS / PAGES)](#3-đặc-tả-chi-tiết-các-màn-hình-screens--pages)
   - [3.1. Layout Chung & Sidebar Điều Hướng](#31-layout-chung--sidebar-điều-hướng)
   - [3.2. Màn hình Đăng Nhập (LoginPage)](#32-màn-hình-đăng-nhập-loginpage)
   - [3.3. Màn hình Bảng Điều Khiển (Dashboard)](#33-màn-hình-bảng-điều-khiển-dashboard)
   - [3.4. Màn hình Danh Sách Hồ Sơ (RecordsList)](#34-màn-hình-danh-sách-hồ-sơ-recordslist)
   - [3.5. Modal Chi Tiết & Xử Lý Hồ Sơ (RecordsModal)](#35-modal-chi-tiết--xử-lý-hồ-sơ-recordsmodal)
   - [3.6. Màn hình Quản Lý Người Dùng (UserManagement)](#36-màn-hình-quản-lý-người-dùng-usermanagement)
4. [ĐẶC TẢ CHI TIẾT CÁC COMPONENT ĐỘC LẬP](#4-đặc-tả-chi-tiết-các-component-độc-lập)
   - [4.1. RegionalStatsCard (Thống Kê Theo Địa Bàn)](#41-regionalstatscard-thống-kê-theo-địa-bàn)
   - [4.2. GisVisualMapCard (Bản Đồ Điểm GIS Đa Hướng)](#42-gisvisualmapcard-bản-đồ-điểm-gis-đa-hướng)
   - [4.3. GisPhuongHeatmapMock (Bản Đồ Mật Độ Cụm Phường)](#43-gisphuongheatmapmock-bản-đồ-mật-độ-cụm-phường)
   - [4.4. CompanionDonorsList (Vinh Danh Nhà Tài Trợ & Top Spotlight)](#44-companiondonorslist-vinh-danh-nhà-tài-trợ--top-spotlight)
5. [ĐẶC TẢ MÔ HÌNH DỮ LIỆU TOÀN DIỆN (DATA SCHEMAS)](#5-đặc-tả-mô-hình-dữ-liệu-toàn-diện-data-schemas)
6. [ĐẶC TẢ API CONTRACTS ĐẦY ĐỦ (API SPECIFICATIONS)](#6-đặc-tả-api-contracts-đầy-đủ-api-specifications)
7. [HƯỚNG DẪN TÁI DỰNG & CHUYỂN ĐỔI NỀN TẢNG (RE-PLATFORMING GUIDE)](#7-hướng-dẫn-tái-dựng--chuyển-đổi-nền-tảng-re-platforming-guide)

---

## 1. TỔNG QUAN HỆ THỐNG & KIẾN TRÚC MỨC THẤP

### 1.1. Công nghệ hiện tại của Ứng dụng
* **Frontend SPA:** React 19, TypeScript, Vite.
* **Styling & Effects:** Tailwind CSS (v4), Motion (`motion/react`), Lucide React Icons.
* **Data Visualization:** Recharts (BarChart, PieChart, Cell, Tooltip, ResponsiveContainer).
* **Parser & Utils:** `papaparse` (xử lý CSV stream), `date-fns` (tính toán chênh lệch thời gian), `clsx` & `tailwind-merge` (`cn` helper).
* **Storage & Backend hiện hữu:**
  * Đọc dữ liệu hồ sơ: Google Sheets công khai dạng CSV stream (realtime bypass cache).
  * Ghi dữ liệu hồ sơ: Google Apps Script Web App (Webhook HTTP POST với token bảo mật).
  * CRUD Người dùng: Google Apps Script Web App (HTTP GET / POST với SECRET_TOKEN).
  * Session cục bộ: `localStorage` (`key: 'user'`).

### 1.2. Sơ đồ Kiến trúc Thành phần (Component Hierarchy)

```
App.tsx
│
├── AuthProvider (AuthContext.tsx)
│   └── RecordProvider (RecordContext.tsx)
│       └── Router (HashRouter)
│           ├── Route /login -> LoginPage.tsx
│           │
│           └── Layout (Layout.tsx) [Protected]
│               ├── Sidebar (Desktop) / Mobile Header & Overlay
│               │   ├── Navigation Links (Dashboard, Records, Users [Admin])
│               │   └── External Google Drive Links (5 Links danh mục hỗ trợ)
│               │
│               ├── Route / (Dashboard.tsx)
│               │   ├── Quick Stats (4 Metric Cards)
│               │   ├── BarChart (Phân loại đối tượng)
│               │   ├── PieChart (Tiến độ hoàn thành)
│               │   ├── RegionalStatsCard.tsx (Chart / List view)
│               │   ├── GisVisualMapCard.tsx (Bản đồ điểm phân tán đa hướng)
│               │   ├── GisPhuongHeatmapMock.tsx (Bản đồ cụm phường)
│               │   ├── CompanionDonorsList.tsx (Top 1, Top 2, List, Modal xem ảnh)
│               │   ├── Coordinating Units (Đơn vị phối hợp)
│               │   └── Recent Activities (Nhật ký hỗ trợ mới)
│               │
│               ├── Route /records (RecordsList.tsx)
│               │   ├── Search Bar & Multi-Select Category Dropdown & Status Filter
│               │   ├── Records Table (Desktop) / Records Cards (Mobile)
│               │   └── RecordsModal.tsx (Xem/Sửa hồ sơ, Timeline, Ảnh minh chứng)
│               │
│               └── Route /users (UserManagement.tsx) [ADMIN only]
│                   ├── Header & Search / Filter Role
│                   ├── User Table
│                   ├── Add/Edit User Modal (Validation, Pass toggle)
│                   └── Delete Confirmation Modal
```

---

## 2. QUẢN LÝ TRẠNG THÁI & PHÂN QUYỀN (STATE & RBAC)

### 2.1. Phân quyền Người dùng (Role-Based Access Control - RBAC)

Hệ thống định nghĩa 3 vai trò người dùng trong `src/types/index.ts`:

| Vai trò (Role) | Mô tả | Quyền hạn trên Giao diện |
| :--- | :--- | :--- |
| `ADMIN` | Quản trị viên hệ thống | - Xem toàn bộ Dashboard, thống kê nâng cao.<br>- Xem & Sửa tất cả các trường hồ sơ trong `RecordsModal` (bao gồm các cột quản trị nhạy cảm `col4`, `addressStatus`, `objectOrTypeNeed`, `col15`, `col16`).<br>- Truy cập menu và trang `/users` để Thêm, Sửa, Xóa, Phân quyền người dùng. |
| `OFFICER` | Cán bộ tiếp nhận & xử lý | - Xem Dashboard.<br>- Xem & Cập nhật diễn biến xử lý hồ sơ tại `/records`.<br>- **Hạn chế:** Hệ thống tự động **ẩn** các trường nhạy cảm (`col4`, `addressStatus`, `objectOrTypeNeed`, `col15`, `col16`) trên form xử lý để tránh thay đổi chính sách.<br>- Không có quyền truy cập trang `/users`. |
| `CITIZEN` | Người dân / Nhà hảo tâm | - Xem Dashboard công khai.<br>- Xem danh sách hồ sơ tại `/records`.<br>- Tại `RecordsModal`: Chỉ hiển thị giao diện **Read-Only** (không hiển thị form input), xem Timeline hỗ trợ và ảnh minh chứng trao quà thực tế.<br>- Không có quyền truy cập trang `/users`. |

### 2.2. Chi tiết State Management

#### AuthContext (`src/AuthContext.tsx`)
* `user`: `User | null` - Lưu thông tin định danh người dùng đăng nhập hiện tại. Khởi tạo từ `localStorage.getItem('user')`.
* `isAuthenticated`: `boolean` - `!!user`.
* `loading`: `boolean` - Trạng thái kiểm tra token phiên.
* `login(username, password)`: Xác thực thông tin qua danh sách `MOCK_USERS` hoặc API. Lưu kết quả vào `localStorage`.
* `logout()`: Xóa `user` khỏi state và xóa `localStorage.removeItem('user')`.

#### RecordContext (`src/RecordContext.tsx`)
* `records`: `SocialRecord[]` - Danh sách toàn bộ các hồ sơ an sinh xã hội.
* `isLoading`: `boolean` - Trạng thái đang tải dữ liệu CSV từ Google Sheets.
* `refreshRecords()`: Gọi lại hàm `fetchRecordsFromSheets()` từ `dataService.ts` với cache-busting timestamp để ép tải dữ liệu mới nhất. Fallback về `MOCK_RECORDS` nếu lỗi mạng hoặc HTTP fail.

---

## 3. ĐẶC TẢ CHI TIẾT CÁC MÀN HÌNH (SCREENS / PAGES)

### 3.1. Layout Chung & Sidebar Điều Hướng (`src/components/Layout.tsx`)

#### Mục đích:
Cung cấp khung giao diện cố định (Shell) gồm Header di động, Sidebar cố định trên máy tính, khu vực nội dung chính (`<Outlet />`), và danh mục liên kết tài liệu biểu mẫu đính kèm.

#### Thành phần UI & Components con:
1. **Sidebar Desktop (Cố định bên trái, chiều rộng `w-60` = 240px, dải màu `brand-gradient`):**
   * **Logo Box:** Logo Mặt trận Tổ quốc Việt Nam, tiêu đề "AN SINH XÃ HỘI SỐ", phụ đề "PORTAL QUẢN TRỊ".
   * **Navigation Items:**
     * Bảng điều khiển (`/`, Icon: `LayoutDashboard`)
     * Hồ sơ an sinh (`/records`, Icon: `ClipboardList`)
     * Quản lý người dùng (`/users`, Icon: `Users`) - *Chỉ hiển thị khi `user?.role === 'ADMIN'`*.
   * **Nhóm Liên kết Google Drive Đính kèm (Google Drive Folder & File Links):**
     * `Ds hộ nghèo`: `https://drive.google.com/file/d/1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb/view` (Icon: `Paperclip`)
     * `Ds hộ cận nghèo`: `https://drive.google.com/file/d/1t7ZrZOFftnVMVxtHAK3DljEWoUNfYfCb/view` (Icon: `Paperclip`)
     * `Ds hộ gđ chính sách`: `https://drive.google.com/drive/folders/16snkJ-4uX4k0zUPG54n2YXsYKIDnWwF6?usp=drive_link` (Icon: `Paperclip`)
     * `Ds bảo trợ XH`: `https://drive.google.com/drive/folders/1km49MdnRfnGUTIZsQRSfvvR5unUpXMBy?usp=drive_link` (Icon: `Paperclip`)
     * `Ds tặng quà`: `https://drive.google.com/drive/folders/1CAyhZKSYJnGFWZdgZcxfcu9IpY7SXHOf?usp=drive_link` (Icon: `Paperclip`)
   * **User Profile & Logout:**
     * Avatar/Icon, Họ và tên người dùng (`user?.fullName`), Vai trò (`user?.role`).
     * Nút "Đăng xuất" (Icon: `LogOut`).
     * Phiên bản: "phiên bản v2.4.0".
2. **Mobile Header & Drawer:**
   * Hiển thị logo, tiêu đề, nút hamburger menu (`Menu` / `X`).
   * Dropdown drawer trượt xuống từ đỉnh màn hình hiển thị toàn bộ navigation và nút Đăng xuất.
3. **Main Content Container:**
   * Wrapper `max-w-7xl mx-auto p-4 md:p-8 overflow-y-auto`.

---

### 3.2. Màn hình Đăng Nhập (`src/pages/LoginPage.tsx`)

#### Mục đích:
Cổng xác thực danh tính cho cán bộ, quản trị viên và người dân trước khi truy cập hệ thống.

#### Thành phần Giao diện & Form Fields:
* **Background:** Nền `bg-slate-50` kết hợp 2 quả cầu ánh sáng nền (Blurred Orbs: `bg-brand-primary` & `bg-brand-accent`).
* **Branding:** Logo MTTQ Việt Nam, Tiêu đề "Hệ thống An sinh Số", Phụ đề "Mặt trận Tổ quốc Việt Nam".
* **Các trường nhập liệu:**
  1. `username`: Text input, icon `User`, placeholder `admin / canbo / dan`, bắt buộc.
  2. `password`: Password input, icon `Lock`, nút toggle ẩn/hiện mắt (`Eye` / `EyeOff`), bắt buộc.
* **Xử lý sự kiện:**
  * Submit form -> `handleLogin(e)` -> gọi `login(username, password)`.
  * Nếu thành công: Điều hướng tới trang trước đó (`location.state.from`) hoặc mặc định `/`.
  * Nếu thất bại: Hiển thị Banner cảnh báo lỗi màu đỏ (`AlertCircle`) với thông báo: *"Tên đăng nhập hoặc mật khẩu không chính xác"*.
  * Trạng thái `isLoading`: Nút hiển thị animation *"Đang đăng nhập..."* và vô hiệu hóa (`disabled`).

#### Tài khoản mẫu (Default Credentials):
* `admin` / `MttqHoaBinh@2026@admin` (Role: ADMIN)
* `canbo` / `MttqHoaBinh@2026@canbo` (Role: OFFICER)
* `dan` / `123` (Role: CITIZEN)

---

### 3.3. Màn hình Bảng Điều Khiển (`src/pages/Dashboard.tsx`)

#### Mục đích:
Trung tâm phân tích trực quan, theo dõi số liệu thống kê hồ sơ, tiến độ hoàn thành, bản đồ GIS nhiệt và danh sách các đơn vị tài trợ đồng hành.

#### Dữ liệu tính toán & Metrics (Logic Memoized `stats`):
* `total`: Tổng số hồ sơ (`records.length`).
* `processing`: Số hồ sơ có `resolutionStatus === 'Đang xử lý'`.
* `completed`: Số hồ sơ có `resolutionStatus === 'Hoàn thành'`.
* `completionRate`: Tỷ lệ phần trăm hoàn thành = `Math.round((completed / total) * 100)`.
* `avgHours`: Thời gian xử lý trung bình (giờ).
  * **Giải thuật tính toán:** Duyệt qua các hồ sơ đã hoàn thành có cả `timestamp` và `completionTime`. Dùng `date-fns/parse` chuyển đổi chuỗi ngày (`dd/MM/yyyy HH:mm:ss` hoặc `yyyy-MM-dd HH:mm:ss`), tính hiệu số phút qua `differenceInMinutes`, sau đó tính trung bình và quy đổi ra giờ (`(avgMinutes / 60).toFixed(1)`).
* `phuongData`: Phân bố hồ sơ theo từng phường/xã.
  * **Giải thuật trích xuất phường:** Dùng hàm `extractWardName(address)` phân tích regex để lấy tên phường cũ hoặc phường mới, chuẩn hóa qua `normalizeWardName(name)`.
* `categoryData`: Phân bố theo đối tượng chính sách (`Hộ nghèo`, `Hộ cận nghèo`, `Gia đình chính sách`...).
* `coordinatingData`: Lượt tham gia của từng đơn vị phối hợp (`coordinatingUnit`).
* `recentActivities`: 5 hoạt động cập nhật gần nhất từ các trường `supportHistoryNew`, `result`, `processingOfficer`.

#### Chi tiết các khối Component trên Giao diện:
1. **Header:** Tiêu đề "Bảng điều khiển", mô tả, Badge thời gian cập nhật thực tế theo ngày hiện tại (`vi-VN`).
2. **Hàng 4 Quick Stat Cards (Grid 1x4):**
   * *Tổng hồ sơ*: Giá trị số nguyên, Icon: `Users`, Viền: `border-brand-accent`.
   * *Tỷ lệ hoàn thành*: `%`, Icon: `ShieldCheck`, Viền: `border-emerald-500`.
   * *Thời gian xử lý TB*: `...h`, Icon: `Timer`, Viền: `border-blue-500`.
   * *Đang chờ xử lý*: Số hồ sơ, Icon: `Clock`, Viền: `border-brand-primary`.
3. **Khu vực Phân tích Chi tiết (Grid 2 cột):**
   * **Cột trái (lg:col-span-2):** Biểu đồ BarChart Recharts - Phân tích số lượng theo từng đối tượng hỗ trợ (`categoryData`).
   * **Cột phải (lg:col-span-1):** Biểu đồ Donut PieChart Recharts - Tiến độ hoàn thành (Màu xanh Emerald cho "Đã xong", Xám nhạt cho "Chưa hoàn thành", chính giữa hiển thị tỷ lệ `%` to bản với animation spring).
4. **Khu vực Bản đồ & Địa bàn (Grid 3 cột):**
   * **Cột 1 (lg:col-span-1):** `<RegionalStatsCard phuongData={stats.phuongData} />` (Xem mục 4.1).
   * **Cột 2 (lg:col-span-2):** `<GisVisualMapCard records={records} phuongData={stats.phuongData} colors={COLORS} />` (Xem mục 4.2).
5. **Khu vực Bản đồ Cụm Phường GIS:**
   * `<GisPhuongHeatmapMock records={records} phuongData={stats.phuongData} />` (Xem mục 4.3).
6. **Khu vực Vinh danh Nhà tài trợ:**
   * `<CompanionDonorsList />` (Xem mục 4.4).
7. **Khu vực Liên kết & Nhật ký mới (Grid 2 cột):**
   * Khối "Sự tham gia của Đơn vị phối hợp": Danh sách cuộn các đơn vị (`coordinatingUnit`) và số lượt.
   * Khối "Nhật ký hỗ trợ mới cập nhật": 5 bản ghi mới nhất hiển thị tên công dân, trạng thái, trích đoạn nội dung hỗ trợ, cán bộ phụ trách và thời gian.
8. **Loading Toast:** Khi `isLoading === true`, hiển thị toast nổi góc dưới bên phải màn hình: *"Đang tải dữ liệu từ Google Sheets..."*.

---

### 3.4. Màn hình Danh Sách Hồ Sơ (`src/pages/RecordsList.tsx`)

#### Mục đích:
Quản lý tập trung toàn bộ danh sách hồ sơ an sinh xã hội, tìm kiếm nhanh, lọc đa tiêu chí theo phân loại đối tượng và trạng thái, mở modal xem hoặc xử lý.

#### State của Trang:
* `searchTerm`: Từ khóa tìm kiếm chuỗi tự do.
* `filterStatus`: Lọc theo tình trạng giải quyết (`'all'`, `'Kiểm tra hồ sơ'`, `'Đang xử lý'`, `'Trả kết quả'`, `'Hoàn thành'`).
* `filterCategories`: Mảng string các phân loại được chọn (`['all']` hoặc danh sách các category cụ thể).
* `isCategoryDropdownOpen`: Trạng thái đóng/mở popover lọc phân loại.
* `selectedRecord`: Hồ sơ đang được chọn mở Modal (`SocialRecord | null`).
* `isUpdating`: Trạng thái gửi API cập nhật hồ sơ (`boolean`).
* `processingData`: State form lưu toàn bộ các trường chuẩn bị submit.

#### Bộ lọc & Tìm kiếm (Filters):
1. **Search Input:** Tìm kiếm tức thì không phân biệt hoa thường theo: `id`, `fullName`, `headOfHousehold`, `oldAddress`, `phone`, `cccd`, `category`.
2. **Category Multi-Select Filter:**
   * Nút dropdown hiển thị: *"Tất cả phân loại"* hoặc *"Đã chọn (N)"*.
   * Menu dạng Popover có checkbox chọn *"Tất cả phân loại"*, danh sách các category trích xuất động từ tập hồ sơ (kèm danh mục mặc định: `Đối tượng Bảo trợ`, `Gia đình chính sách`, `Hộ cận nghèo`, `Hộ có hoàn cảnh khó khăn`, `Hộ khó khăn`, `Hộ nghèo`).
3. **Status Dropdown Filter:** Lọc nhanh theo `resolutionStatus`.

#### Chế độ hiển thị Responsive:
1. **Desktop Table View (`hidden md:block`):**
   * Cột 1: **Mã hồ sơ** (`id`).
   * Cột 2: **Chủ hộ / Đối tượng** (`headOfHousehold` hoặc `fullName`, số điện thoại format `0{phone}`).
   * Cột 3: **Địa bàn** (`oldAddress`).
   * Cột 4: **Phân loại** (`category` badge).
   * Cột 5: **Trạng thái** (`resolutionStatus` với các class CSS: `badge-complete`, `badge-processing`, `badge-urgent`).
   * Cột 6: **Thao tác**: Nút `Xem` (nếu role CITIZEN) hoặc `Xử lý` (nếu role OFFICER / ADMIN).
2. **Mobile Card View (`block md:hidden`):**
   * Card với viền trái `border-l-4 border-l-brand-primary`.
   * Hiển thị mã hồ sơ, tên chủ hộ, phân loại, badge trạng thái.
   * Hiển thị địa chỉ có icon `MapPin`, số điện thoại có icon `Phone`.
   * Nút bấm toàn chiều rộng: *"Xem chi tiết hồ sơ"* hoặc *"Tiến hành xử lý hồ sơ"*.

---

### 3.5. Modal Chi Tiết & Xử Lý Hồ Sơ (`src/pages/RecordsModal.tsx`)

#### Mục đích:
Cửa sổ tương tác sâu nhất của hệ thống, cho phép xem chi tiết hồ sơ đối với Người dân hoặc chỉnh sửa toàn bộ các trường nghiệp vụ đối với Cán bộ và Quản trị viên.

#### Props Interface:
```typescript
interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecord: SocialRecord | null;
  processingData: any;
  setProcessingData: React.Dispatch<React.SetStateAction<any>>;
  isUpdating: boolean;
  onUpdate: () => Promise<void>;
  userRole?: string;
}
```

#### Giao diện 1: Dành cho Người dân (`userRole === 'CITIZEN'`) - Read Only
* **Khối 1: Kết quả hỗ trợ & Chủ hộ:**
  * Kết quả hỗ trợ (`selectedRecord.result`): Highlight badge lớn.
  * Họ và tên chủ hộ (`selectedRecord.headOfHousehold`).
  * Hoàn cảnh gia đình (`selectedRecord.familyCircumstance`): Hộp trích dẫn màu xám chữ nghiêng.
* **Khối 2: Nhu cầu & Địa chỉ:**
  * Nhu cầu hỗ trợ (`selectedRecord.supportNeed`): Kèm icon cảnh báo `AlertCircle`.
  * Hộ khẩu thường trú (`selectedRecord.residentAddress`).
* **Khối 3: Lịch sử hỗ trợ cũ (`selectedRecord.supportHistory`):** Văn bản hiển thị nhiều dòng (`whitespace-pre-line`).
* **Khối 4: Timeline Lịch sử Hỗ trợ Mới Thực Hiện (`selectedRecord.supportHistoryNew`):**
  * **Giải thuật bóc tách:** Regex `split(/\n(?=\[)/)` tách các khối ghi chú bắt đầu bằng dấu ngoặc vuông `[dd/MM/yyyy]`.
  * Match regex: `/\[(.*?)\]\s*(.*)/` -> lấy ra `date` (ngày tháng) và `content` (nội dung chi tiết).
  * Vẽ trục thời gian thẳng đứng (Vertical Timeline) với chấm tròn xanh, vòng ring hiệu ứng và đường kẻ nối liền mạch giữa các mốc.
* **Khối 5: Hình ảnh minh chứng trao tặng:**
  * Hiển thị khung ảnh thực tế với caption *"Hình ảnh trao tặng quà thực tế - Cho đi là còn mãi"*.
  * Nếu không có ảnh minh chứng, sử dụng ảnh fallback sự kiện nhân đạo.

#### Giao diện 2: Dành cho Cán bộ & Quản trị viên (`userRole !== 'CITIZEN'`) - Editable Form
Giao diện phân thành 5 phân nhóm nghiệp vụ rõ ràng:

1. **Phân nhóm 1: Thông tin định danh & Cá nhân (Icon: `User`)**
   * `headOfHousehold`: Họ và tên chủ hộ (Text input)
   * `phone`: Số điện thoại chính (Text input)
   * `contactPhone`: Số điện thoại liên hệ mới nhất (Text input)
   * `birthDate`: Ngày sinh định dạng `DD/MM/YYYY` (Text input)
   * `cccd`: Số Căn cước công dân (Text input)
2. **Phân nhóm 2: Địa chỉ & Hộ khẩu (Icon: `MapPin`)**
   * `oldAddress`: Địa chỉ cũ trước sáp nhập (Text input, chiếm 2 cột)
   * `residentAddress`: Hộ khẩu thường trú hiện nay (Text input, chiếm 2 cột)
   * `headOfHousehold`: Tên chủ hộ (Text input)
   * `issuedDate`: Ngày cấp CCCD (Text input)
3. **Phân nhóm 3: Phân loại & Hoàn cảnh (Icon: `ClipboardCheck`)**
   * `category`: Phân loại chính sách (Dropdown Select: `Hộ nghèo`, `Hộ cận nghèo`, `Hộ khó khăn`, `Hộ gia đình chính sách`, `Đối tượng bảo trợ`, `Khác`, `Nhà hảo tâm`).
   * `col4`: Phân loại đối tượng hoặc nhà hảo tâm (*Chỉ hiển thị với ADMIN, ẩn với OFFICER*).
   * `familyCircumstance`: Mô tả hoàn cảnh gia đình (Textarea 2 dòng).
   * `addressStatus`: Tình trạng hỗ trợ ban đầu (*Chỉ hiển thị với ADMIN, ẩn với OFFICER*).
   * `supportNeed`: Nhu cầu hỗ trợ cụ thể (Text input).
4. **Phân nhóm 4: Cột mở rộng quản trị (Icon: `TrendingUp`) - *Chỉ hiển thị với ADMIN, ẩn với OFFICER***
   * `objectOrTypeNeed`: Đối tượng hoặc hình thức hỗ trợ (Text input).
   * `col15`: Giá trị cột 15 (Text input).
   * `col16`: Giá trị cột 16 (Text input).
5. **Phân nhóm 5: Trạng thái xử lý & Kết quả (Icon: `Activity`)**
   * `resolutionStatus`: Tình trạng giải quyết (Dropdown Select: `Mới tiếp nhận`, `Kiểm tra hồ sơ`, `Phối hợp xử lý lại đơn vị`, `Đang xử lý`, `Hoàn thành`, `Trả kết quả`).
   * `updatedSupportStatus`: Cập nhật tình trạng hỗ trợ (Text input).
   * `processingOfficer`: Cán bộ thực hiện (Text input).
   * `coordinatingUnit`: Cá nhân hoặc Đơn vị phối hợp (Text input, chiếm 2 cột).
   * `supportType`: Hình thức hỗ trợ thực tế (Text input).
   * `donorAddress`: Địa chỉ nhà hảo tâm (Text input, chiếm 2 cột).
   * `result`: Kết quả xử lý (Textarea 2 dòng).
   * `supportHistoryLast`: Nhập diễn biến hỗ trợ mới nhất (Textarea 3 dòng). Giao diện hiển thị sẵn hộp ghi chú lịch sử cũ và lịch sử mới để đối chiếu.
   * `proofImageUrl`: URL hình ảnh minh chứng trao tặng quà (kèm khung preview ảnh trực quan).

#### Nút Thao tác Modal:
* Nút "Hủy bỏ": Đóng modal, không lưu.
* Nút "Cập nhật tất cả": Kích hoạt `onUpdate()`. Khi đang gửi API, nút chuyển sang *"Đang đồng bộ..."* và hiệu ứng animate-pulse.

---

### 3.6. Màn hình Quản Lý Người Dùng (`src/pages/UserManagement.tsx`)

#### Mục đích:
Dành riêng cho Quản trị viên (`ADMIN`) quản lý danh sách tài khoản đăng nhập vào hệ thống, phân quyền, đặt mật khẩu và kích hoạt/vô hiệu hóa trạng thái người dùng.

#### State của Trang:
* `users`: `User[]` - Danh sách tài khoản lấy từ API.
* `isLoading`: Boolean tải lần đầu.
* `isRefreshing`: Boolean làm mới dữ liệu nền.
* `searchTerm`: Tìm kiếm theo `username` hoặc `fullName`.
* `roleFilter`: Lọc theo quyền (`'ALL'`, `'ADMIN'`, `'OFFICER'`, `'CITIZEN'`).
* `isModalOpen`: Trạng thái mở modal Thêm/Sửa.
* `editingUser`: User đang sửa (`User | null`). Nếu `null` là thêm mới.
* `showPassword`: Boolean toggle ẩn/hiện mật khẩu.
* `userToDelete`: User đang chờ xác nhận xóa (`User | null`).
* `formData`: State form `{ username, fullName, password, email, role, status }`.
* `errors`: Record lưu thông báo lỗi validate form.
* `toastMessage`: Toast thông báo thành công hoặc thất bại dạng floating badge.

#### Quy tắc Validation Form Người dùng:
1. `username`: Bắt buộc nhập, không được chứa khoảng trắng thừa, không được trùng với username của người dùng khác trong hệ thống.
2. `fullName`: Bắt buộc nhập.
3. `password`: Bắt buộc nhập khi **tạo mới**; khi **chỉnh sửa**, nếu để trống hệ thống sẽ giữ nguyên mật khẩu cũ.
4. `email`: Tùy chọn, nhưng nếu có nhập phải khớp biểu thức chính quy email `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
5. `role`: Giá trị hợp lệ: `ADMIN`, `OFFICER`, `CITIZEN`.
6. `status`: Giá trị hợp lệ: `ACTIVE`, `INACTIVE`.

#### Modal Xóa Người Dùng (Confirmation Dialog):
* Hiển thị cảnh báo nguy hiểm với icon `AlertTriangle` màu đỏ.
* Hiển thị rõ tên người dùng và username cần xóa.
* Nút "Hủy thao tác" và nút "Xóa" (có hiệu ứng xoay spinner khi `isDeleting === true`).

---

## 4. ĐẶC TẢ CHI TIẾT CÁC COMPONENT ĐỘC LẬP

### 4.1. RegionalStatsCard (`src/components/RegionalStatsCard.tsx`)
* **Chức năng:** Thống kê tỷ trọng hồ sơ theo từng phường/xã.
* **Props:** `phuongData: Array<{ name: string; value: number }>`.
* **Chế độ xem (View Mode):**
  1. *Chế độ Biểu đồ (`chart`):*
     * Hiển thị PieChart dạng Donut (`innerRadius={55}`, `outerRadius={78}`, `paddingAngle={5}`).
     * Bảng chú giải bên dưới có thanh cuộn (`max-h-36 overflow-y-auto`) hiển thị dot màu, tên địa bàn, phần trăm (`%`) và số lượng hồ sơ.
     * Nút bấm mở rộng: *"Xem tất cả N địa bàn"* / *"Thu gọn"* khi danh sách có trên 6 địa bàn.
  2. *Chế độ Danh sách (`list`):*
     * Danh sách xếp hạng từ cao xuống thấp (#1, #2, #3...), hiển thị số hồ sơ và tỷ trọng trên tổng thể.

### 4.2. GisVisualMapCard (`src/components/GisVisualMapCard.tsx`)
* **Chức năng:** Mô phỏng bản đồ nhiệt trực quan và vị trí các điểm hồ sơ an sinh trên địa bàn.
* **Props:**
  * `records: SocialRecord[]`
  * `phuongData: { name: string; value: number }[]`
  * `colors: string[]`
* **Giải thuật Phân tán Điểm ghim Đa hướng (Multi-directional Distributed Pins):**
  * Để tránh việc toàn bộ các điểm hồ sơ bị tập trung vào chính giữa bản đồ gây đè lấn điểm, component sử dụng giải thuật giả ngẫu nhiên có tính xác định (Deterministic Hash) dựa trên chuỗi `record.id`:
    $$\text{seed} = \sum (\text{charCode}) + i \times 37$$
    $$\text{topPos} = 18\% + (\text{seed} \pmod{65})$$
    $$\text{leftPos} = 15\% + ((\text{seed} \times 31) \pmod{70})$$
  * Tọa độ phân bố trải rộng từ 18% đến 83% chiều dọc và 15% đến 85% chiều ngang, dàn đều về các góc bản đồ.
* **Hiệu ứng & Tương tác:**
  * Vòng tròn ping màu đỏ nhấp nháy (`animate-ping`) kết hợp tâm điểm đỏ viền trắng.
  * Hover Tooltip: Hiển thị tên chủ hộ, địa chỉ cũ, tình trạng giải quyết và phân loại đối tượng.
  * Box chú giải vùng (Legend Overlay) gắn ở góc dưới bên trái có thanh cuộn danh sách phường.

### 4.3. GisPhuongHeatmapMock (`src/components/GisPhuongHeatmapMock.tsx`)
* **Chức năng:** Bản đồ mật độ nhóm theo từng đơn vị Phường hành chính.
* **Tọa độ Neo (Anchor Positions) chuẩn hóa:**
  * Phường Phương Lâm: `{ top: '35%', left: '42%' }`
  * Phường Thịnh Lang / Thịnh Lang cũ: `{ top: '25%', left: '65%' }`
  * Phường Hòa Bình / Hoà Bình: `{ top: '55%', left: '50%' }`
  * Phường Đồng Tiến: `{ top: '65%', left: '70%' }`
  * Phường Tân Thịnh: `{ top: '20%', left: '30%' }`
  * Phường Hữu Nghị / Hữu Nghị cũ: `{ top: '45%', left: '25%' }`
  * Phường Trung Minh cũ: `{ top: '30%', left: '55%' }`
  * Phường Thống Nhất: `{ top: '70%', left: '35%' }`
* **Hiệu ứng trực quan:**
  * Quầng sáng nhiệt tỏa rộng tỷ lệ thuận với số lượng hồ sơ: `width = max(45, count * 6)px`.
  * Chu kỳ hiệu ứng nhấp nháy đặt ở mức 4 giây (`animation: 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite'`) để tạo cảm giác êm dịu, không gây mỏi mắt.
  * Badge tên phường gắn kèm số lượng hồ sơ. Hover vào badge sẽ mở popup liệt kê danh sách các công dân thuộc phường đó.

### 4.4. CompanionDonorsList (`src/components/CompanionDonorsList.tsx`)
* **Chức năng:** Vinh danh các doanh nghiệp, tổ chức và cá nhân tài trợ cho các chương trình an sinh xã hội.
* **Thành phần nổi bật (Spotlight Top 1 & Top 2):**
  * Tự động sắp xếp nhà tài trợ theo số tiền ủng hộ (`amount`) giảm dần.
  * **Top 1 Vàng:** Card viền vàng ánh kim (`border-amber-400/50`), huy hiệu Cúp Vàng (`Trophy`), hiển thị ảnh hoạt động thực tế, tên đơn vị, số tiền ủng hộ (format VND) và số suất quà.
  * **Top 2 Bạc:** Card viền bạc (`border-slate-300`), huy hiệu Huy chương Bạc (`Medal`), hiển thị ảnh hoạt động, số tiền và số suất quà.
* **Xử lý URL Ảnh Google Drive (`getValidImageUrl`):**
  * Chuyển đổi linh hoạt link Google Drive dạng `https://drive.google.com/file/d/{FILE_ID}/view` thành link ảnh hiển thị trực tiếp chất lượng cao: `https://lh3.googleusercontent.com/d/{FILE_ID}=s800`.
  * Fallback sang ảnh Unsplash từ thiện nếu URL rỗng hoặc sai cú pháp.
* **Danh sách còn lại (#3, #4...):** Card thu gọn hiển thị ngày trao tặng, số suất quà, số tiền và nút "Xem ảnh".
* **Khối Tổng Nguồn Lực Vận Động:** Hiển thị tổng số tiền quyên góp (VNĐ) và tổng số suất quà an sinh.
* **Detail/Photo Modal:** Bấm vào bất kỳ nhà tài trợ nào sẽ mở cửa sổ popup xem hình ảnh khổ lớn, nội dung chương trình nhân đạo chi tiết và quy mô hỗ trợ.

---

## 5. ĐẶC TẢ MÔ HÌNH DỮ LIỆU TOÀN DIỆN (DATA SCHEMAS)

### 5.1. Bảng Dữ liệu Người Dùng (`User`)

| Tên thuộc tính | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `string` | Có | Khóa chính duy nhất (Ví dụ: `'1'`, `'1715432109'`) |
| `username` | `string` | Có | Tên đăng nhập duy nhất (Ví dụ: `'admin'`, `'canbo'`) |
| `fullName` | `string` | Có | Họ và tên đầy đủ |
| `role` | `'ADMIN' \| 'OFFICER' \| 'CITIZEN'` | Có | Vai trò phân quyền trong hệ thống |
| `password` | `string` | Không | Mật khẩu tài khoản (lưu hash trên DB mới) |
| `email` | `string` | Không | Địa chỉ thư điện tử |
| `create_date` | `string` | Không | Ngày tạo tài khoản |
| `status` | `'ACTIVE' \| 'INACTIVE'` | Không | Trạng thái tài khoản (mặc định `'ACTIVE'`) |
| `avatar` | `string` | Không | Đường dẫn ảnh đại diện |

---

### 5.2. Bảng Dữ liệu Hồ Sơ An Sinh (`SocialRecord`)

Bảng dưới đây mô tả sự tương ứng giữa thuộc tính trong mã nguồn ứng dụng, tiêu đề cột trên Google Sheets hiện tại, và tên cột đề xuất cho Cơ sở dữ liệu quan hệ (PostgreSQL/MySQL):

| Thuộc tính JSON (`SocialRecord`) | Tiêu đề Cột Google Sheets | Tên Cột Đề xuất (SQL) | Kiểu dữ liệu | Mô tả chi tiết |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `ID` | `record_code` | `VARCHAR(50)` | Mã định danh hồ sơ (Ví dụ: `HS0000000004`) |
| `timestamp` | `Dấu thời gian` | `created_at` | `TIMESTAMP` | Thời điểm nộp/nhập hồ sơ ban đầu |
| `fullName` | `Họ và tên` | `full_name` | `VARCHAR(255)` | Họ tên người đăng ký hoặc người khai hộ |
| `phone` | `Số điện thọai` / `Số điện thoại` | `phone_number` | `VARCHAR(20)` | Số điện thoại chính |
| `headOfHousehold` | `Họ và tên chủ hộ` | `head_of_household` | `VARCHAR(255)` | Họ tên chủ hộ gia đình thụ hưởng |
| `birthDate` | `Ngày tháng năm sinh` | `birth_date` | `VARCHAR(20)` | Ngày sinh (`DD/MM/YYYY`) |
| `cccd` | `Số CCCD` | `identity_card_number` | `VARCHAR(20)` | Số Căn cước công dân (12 chữ số) |
| `issuedDate` | `Ngày cấp` | `id_issued_date` | `VARCHAR(20)` | Ngày cấp Căn cước công dân |
| `contactPhone` | `Số điện thoại liên hệ` | `contact_phone` | `VARCHAR(20)` | Số điện thoại liên lạc bổ sung do cán bộ xác minh |
| `category` | `Là đối tượng` / `Đối tượng` | `category` | `VARCHAR(100)` | Phân loại chính sách: `Hộ nghèo`, `Hộ cận nghèo`, `Hộ gia đình chính sách`, v.v. |
| `addressStatus` | `tình trạng hỗ trợ` / `tình trạng` | `address_status` | `VARCHAR(100)` | Tình trạng hỗ trợ ban đầu |
| `oldAddress` | `Địa chỉ cũ trước khi sáp nhập` | `old_address` | `TEXT` | Địa chỉ theo đơn vị hành chính cũ trước khi sáp nhập |
| `residentAddress` | `Hộ khẩu thường trú hiện nay` | `resident_address` | `TEXT` | Địa chỉ hộ khẩu thường trú đầy đủ hiện tại |
| `familyCircumstance` | `Hoàn cảnh gia đình` | `family_circumstance` | `TEXT` | Mô tả chi tiết hoàn cảnh kinh tế, bệnh tật, khó khăn |
| `supportNeed` | `Nhu cầu hỗ trợ` | `support_need` | `TEXT` | Nhu cầu đề xuất: Nhu yếu phẩm, kinh phí, sửa nhà... |
| `supportHistory` | `Nhập Lịch sử hỗ trợ trước đây` | `support_history_old` | `TEXT` | Các đợt hỗ trợ đã nhận trước thời điểm số hóa |
| `evidenceImage` | `Vui lòng cung cấp hình ảnh minh chứng` | `evidence_image_url` | `TEXT` | Ảnh minh chứng hồ sơ gửi kèm |
| `supportType` | `Cập nhật hình thức hỗ trợ` | `support_type` | `VARCHAR(255)` | Hình thức hỗ trợ: Tiền mặt, quà tặng, sinh kế... |
| `supportHistoryNew` | `Cập nhật Lịch sử hỗ trợ` | `support_history_timeline` | `TEXT` | Nhật ký các lần hỗ trợ mới dạng chuỗi timeline `[ngày] nội dung` |
| `processingOfficer` | `Cán bộ thực hiện` | `processing_officer` | `VARCHAR(255)` | Họ tên cán bộ tiếp nhận và xử lý trực tiếp |
| `coordinatingUnit` | `Cập nhật Cá nhân hoặc Đơn vị phối hợp` | `coordinating_unit` | `VARCHAR(255)` | Đơn vị, hội đoàn, nhà hảo tâm cùng tham gia giúp đỡ |
| `updatedSupportStatus` | `Cập nhật tình trạng hỗ trợ` | `updated_support_status` | `VARCHAR(100)` | Tình trạng diễn biến hỗ trợ |
| `resolutionStatus` | `Cập nhật tình trạng giải quyết` | `resolution_status` | `VARCHAR(100)` | Trạng thái luồng: `Mới tiếp nhận`, `Đang xử lý`, `Hoàn thành`... |
| `result` | `Cập nhật Kết quả xử lý` | `result_note` | `TEXT` | Kết quả giải quyết cuối cùng |
| `completionTime` | `Thời gian hoàn thành` | `completed_at` | `TIMESTAMP` | Thời điểm hoàn tất quy trình hỗ trợ |
| `donorAddress` | `địa chỉ nhà hảo tâm` | `donor_address` | `TEXT` | Địa chỉ của đơn vị hoặc cá nhân tài trợ |
| `col4` | `Cột 5` / `Là đối tượng` | `classification_type` | `VARCHAR(100)` | Phân loại: Đối tượng cần hỗ trợ hay Nhà hảo tâm |
| `col15` | `Cột 15` | `custom_column_15` | `TEXT` | Cột mở rộng quản trị 15 |
| `col16` | `Cột 17` | `custom_column_16` | `TEXT` | Cột mở rộng quản trị 16 |
| `objectOrTypeNeed` | `đối tượng hoặc hình thức hỗ trợ` | `object_or_type_need` | `VARCHAR(255)` | Chi tiết đối tượng hoặc hình thức hỗ trợ |
| `to` *(computed)* | *(Bóc tách từ oldAddress)* | `ward_group` | `VARCHAR(50)` | Tổ / Xóm / Thôn trích xuất |
| `phuong` *(computed)* | *(Bóc tách từ oldAddress)* | `ward_name` | `VARCHAR(100)` | Phường / Xã trích xuất |
| `lat` *(computed)* | *(Tính từ tọa độ phường + jitter)* | `latitude` | `DECIMAL(10,7)` | Vĩ độ định vị GIS |
| `lng` *(computed)* | *(Tính từ tọa độ phường + jitter)* | `longitude` | `DECIMAL(10,7)` | Kinh độ định vị GIS |

---

### 5.3. Bảng Dữ liệu Nhà Tài Trợ Đồng Hành (`DonorItem`)

| Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | `string` | Mã định danh đơn vị tài trợ |
| `name` | `string` | Tên cơ quan, doanh nghiệp hoặc cá nhân hảo tâm |
| `amount` | `number` | Tổng giá trị ủng hộ bằng tiền mặt (VNĐ) |
| `giftCount` | `number` | Tổng số suất quà đã trao tặng |
| `date` | `string` | Ngày ghi nhận trao tặng (`DD/MM/YYYY`) |
| `description` | `string` | Nội dung chương trình an sinh xã hội |
| `imageUrl` | `string` | Đường dẫn ảnh chụp trao tặng thực tế |

---

## 6. ĐẶC TẢ API CONTRACTS ĐẦY ĐỦ (API SPECIFICATIONS)

Dưới đây là đặc tả chi tiết của cả **API hiện tại (Google Apps Script / Sheets)** và **RESTful API chuẩn hóa khuyến nghị** khi chuyển giao sang nền tảng Backend mới (Node.js/NestJS/Express, Python/FastAPI, Go hoặc Java Spring):

### 6.1. Nhóm API Quản Trị Người Dùng (User Management API)

#### Endpoint 1: Lấy Danh Sách Người Dùng (List Users)
* **Hiện tại (GAS):**
  * `GET https://script.google.com/macros/s/AKfycbwa2GxyAIs9tZ5fgDeVG80ZP24ELPY5P8HYlK850PhQszBkOYBTdxmOv890hIYBA4oT/exec?action=list&token=MTTQ_HOABINH_2026_SECRET`
* **Chuẩn hóa RESTful:**
  * `GET /api/v1/users`
  * Headers: `Authorization: Bearer <JWT_TOKEN>`
  * Query Params:
    * `search`: string (tìm kiếm theo username, fullName)
    * `role`: string (`ADMIN`, `OFFICER`, `CITIZEN`)
    * `status`: string (`ACTIVE`, `INACTIVE`)
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Lấy danh sách người dùng thành công",
  "data": [
    {
      "id": "1",
      "username": "admin",
      "fullName": "Quản trị viên Hệ thống",
      "role": "ADMIN",
      "email": "admin@mttq.hoabinh.gov.vn",
      "status": "ACTIVE",
      "create_date": "2026-01-01"
    },
    {
      "id": "2",
      "username": "canbo",
      "fullName": "Nguyễn Văn A",
      "role": "OFFICER",
      "email": "canbo@mttq.hoabinh.gov.vn",
      "status": "ACTIVE",
      "create_date": "2026-01-05"
    }
  ]
}
```

---

#### Endpoint 2: Tạo Người Dùng Mới (Create User)
* **Hiện tại (GAS):**
  * `POST https://script.google.com/macros/s/AKfycbwa2GxyAIs9tZ5fgDeVG80ZP24ELPY5P8HYlK850PhQszBkOYBTdxmOv890hIYBA4oT/exec`
  * Content-Type: `text/plain;charset=utf-8`
  * Payload:
```json
{
  "token": "MTTQ_HOABINH_2026_SECRET",
  "action": "create",
  "data": {
    "username": "canbo_phuonglam",
    "fullName": "Trần Thị B",
    "password": "Password@2026",
    "email": "canbo.phuonglam@gmail.com",
    "role": "OFFICER",
    "status": "ACTIVE"
  }
}
```
* **Chuẩn hóa RESTful:**
  * `POST /api/v1/users`
  * Headers: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
  * Request Body:
```json
{
  "username": "canbo_phuonglam",
  "fullName": "Trần Thị B",
  "password": "Password@2026",
  "email": "canbo.phuonglam@gmail.com",
  "role": "OFFICER",
  "status": "ACTIVE"
}
```
* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "Tạo người dùng thành công",
  "data": {
    "id": "1715432890"
  }
}
```

---

#### Endpoint 3: Cập Nhật Người Dùng (Update User)
* **Hiện tại (GAS):**
  * `POST .../exec` với `action: "update"` và `data: { id, username, fullName, password, email, role, status }`.
* **Chuẩn hóa RESTful:**
  * `PUT /api/v1/users/:id`
  * Request Body:
```json
{
  "username": "canbo_phuonglam",
  "fullName": "Trần Thị B (Cán bộ phụ trách)",
  "password": "", 
  "email": "canbo.phuonglam@gmail.com",
  "role": "OFFICER",
  "status": "ACTIVE"
}
```
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Cập nhật người dùng thành công",
  "data": {
    "id": "1715432890"
  }
}
```

---

#### Endpoint 4: Xóa Người Dùng (Delete User)
* **Hiện tại (GAS):**
  * `POST .../exec` với payload `{"token": "MTTQ_HOABINH_2026_SECRET", "action": "delete", "id": "1715432890"}`
* **Chuẩn hóa RESTful:**
  * `DELETE /api/v1/users/:id`
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Xóa người dùng thành công",
  "data": {
    "id": "1715432890"
  }
}
```

---

### 6.2. Nhóm API Quản Lý Hồ Sơ An Sinh (Social Care Records API)

#### Endpoint 5: Lấy Danh Sách Hồ Sơ (Fetch Records)
* **Hiện tại:**
  * `GET https://docs.google.com/spreadsheets/d/e/2PACX-1vSdrdYekjXPY9SzlbGcf4IfFjCTjm6cLB8bfCKl20AeU5sJLYKSg7NU_9Q94NGnEHs4yhf5VZawwlKt/pub?gid=340520941&single=true&output=csv&t={timestamp}`
  * Trả về định dạng CSV, frontend dùng `PapaParse` chuyển đổi thành mảng object `SocialRecord[]`.
* **Chuẩn hóa RESTful:**
  * `GET /api/v1/records`
  * Query Parameters:
    * `page`: int (mặc định 1)
    * `limit`: int (mặc định 50 hoặc 'all')
    * `search`: string (tìm theo tên, cccd, số điện thoại, địa chỉ)
    * `status`: string (trạng thái giải quyết)
    * `category`: string (phân loại chính sách)
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "total": 150,
  "data": [
    {
      "id": "HS0000000004",
      "timestamp": "10/05/2026 18:51:25",
      "fullName": "Trần Khai Hộ",
      "phone": "0986123456",
      "headOfHousehold": "Phạm Văn B",
      "birthDate": "01/01/1960",
      "cccd": "017123456789",
      "issuedDate": "01/12/2021",
      "contactPhone": "0986123456",
      "category": "Hộ nghèo",
      "addressStatus": "Khẩn cấp",
      "donorAddress": "",
      "oldAddress": "Tổ 10, phường Phương Lâm",
      "residentAddress": "Tổ 1, phường Hoà Bình",
      "familyCircumstance": "Bị tai nạn, mất khả năng lao động. Nuôi 2 con ăn học",
      "supportNeed": "Sửa chữa nhà ở do bị xuống cấp nghiêm trọng",
      "supportHistory": "Đã được Hội PN tặng quà trị giá 1.000.000đ tiền mặt",
      "evidenceImage": "https://example.com/images/evidence.jpg",
      "supportType": "Tiền mặt và vật liệu",
      "supportHistoryNew": "[11/05/2026] Đã khảo sát thực địa hiện trạng nhà dột\n[15/05/2026] Đã duyệt cấp kinh phí sửa chữa 15 triệu đồng",
      "processingOfficer": "Nguyễn Văn A",
      "coordinatingUnit": "Hội Chữ Thập Đỏ Phường",
      "updatedSupportStatus": "Đang thi công",
      "resolutionStatus": "Đang xử lý",
      "result": "Đã tiến hành nghiệm thu đợt 1",
      "completionTime": "2026-05-10 20:27:47",
      "col4": "ĐỐI TƯỢNG CẦN HỖ TRỢ",
      "col15": "",
      "col16": "",
      "objectOrTypeNeed": "",
      "to": "10",
      "phuong": "Phương Lâm",
      "lat": 20.8172,
      "lng": 105.3377
    }
  ]
}
```

---

#### Endpoint 6: Cập Nhật Xử Lý Hồ Sơ (Process / Update Record)
* **Hiện tại (GAS):**
  * `POST https://script.google.com/macros/s/AKfycbye05mqpv2R7NH4cGTFev00zuVLCMqBJTA3TNh3wPY1aEoAu0otJNcA2VMPgVz6tw/exec?token=AnSinhXaHoi@2026`
  * Content-Type: `text/plain;charset=utf-8`
  * Payload JSON gửi lên (nguyên bản tiếng Việt ánh xạ chính xác cột trên Sheet):
```json
{
  "id": "HS0000000004",
  "hoTen": "Trần Khai Hộ",
  "soDienThoai": "0986123456",
  "chuHo": "Phạm Văn B",
  "ngaySinh": "01/01/1960",
  "cccd": "017123456789",
  "ngayCap": "01/12/2021",
  "soDienThoaiLienHe": "0986123456",
  "laDoiTuong": "Hộ nghèo",
  "tinhTrangHoTro": "Khẩn cấp",
  "diaChiCu": "Tổ 10, phường Phương Lâm",
  "hoKhau": "Tổ 1, phường Hoà Bình",
  "hoanCanh": "Bị tai nạn, mất khả năng lao động...",
  "nhuCau": "Sửa chữa nhà ở do bị xuống cấp nghiêm trọng",
  "lichSuCu": "Đã được Hội PN tặng quà trị giá 1.000.000đ",
  "hinhThucHoTro": "Tiền mặt",
  "lichSuHoTro": "Cập nhật ngày 20/05/2026: Đã hoàn tất sửa mái tôn",
  "canBo": "Nguyễn Văn A",
  "phoiHop": "Hội Chữ Thập Đỏ Phường",
  "capNhatTinhTrangHoTro": "Đã hoàn thành",
  "tinhTrang": "Hoàn thành",
  "ketQua": "Đã hỗ trợ xong và bàn giao nhà"
}
```
* **Chuẩn hóa RESTful:**
  * `PUT /api/v1/records/:id`
  * Headers: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "message": "Đã cập nhật hồ sơ HS0000000004 thành công",
  "updated_at": "2026-05-20T10:15:30Z"
}
```

---

### 6.3. Nhóm API Báo Cáo & Danh Mục Tài Trợ (Analytics & Donors API)

#### Endpoint 7: Lấy Danh Sách Nhà Tài Trợ Đồng Hành (Get Donors)
* **Chuẩn hóa RESTful:**
  * `GET /api/v1/donors`
* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "totalAmount": 198345752,
  "totalGifts": 300,
  "data": [
    {
      "id": "1",
      "name": "Bệnh viện đa khoa Hòa Bình",
      "amount": 182045752,
      "giftCount": 50,
      "date": "19/04/2026",
      "description": "Chương trình trao quà an sinh xã hội, phát huy vai trò nòng cốt trong sự nghiệp nhân đạo tỉnh Hòa Bình.",
      "imageUrl": "https://drive.google.com/file/d/1bass3JULDU2Nb67ir_YWhGBgT78PMzdX/view"
    },
    {
      "id": "2",
      "name": "Công ty xổ kiến thiết Hòa Bình",
      "amount": 11800000,
      "giftCount": 30,
      "date": "15/12/2025",
      "description": "Hỗ trợ các hộ gia đình chính sách và hộ cận nghèo nhân dịp Tết Ất Tỵ.",
      "imageUrl": "https://drive.google.com/file/d/1tyt25r-7r1RnMReXbkAbUbmu39RF_u2w/view"
    }
  ]
}
```

---

## 7. HƯỚNG DẪN TÁI DỰNG & CHUYỂN ĐỔI NỀN TẢNG (RE-PLATFORMING GUIDE)

Khi đội ngũ kỹ sư chuyển giao dự án từ kiến trúc Serverless Google Sheets/Google Apps Script sang một kiến trúc Web & Cơ sở dữ liệu độc lập (như PostgreSQL + Node.js/NestJS hoặc Go + React/Next.js), cần tuân thủ các chỉ dẫn kỹ thuật sau:

### 7.1. Database Schema DDL Khuyến nghị (PostgreSQL)

```sql
-- 1. Bảng Người dùng & Phân quyền
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'CITIZEN', -- 'ADMIN', 'OFFICER', 'CITIZEN'
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Danh mục Phân loại Đối tượng
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- 3. Bảng Hồ sơ An sinh Xã hội
CREATE TABLE social_records (
    id VARCHAR(50) PRIMARY KEY, -- HS0000000004
    submission_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    contact_phone VARCHAR(20),
    head_of_household VARCHAR(255),
    birth_date VARCHAR(20),
    cccd VARCHAR(20),
    issued_date VARCHAR(20),
    category VARCHAR(100) NOT NULL,
    address_status VARCHAR(100),
    old_address TEXT NOT NULL,
    resident_address TEXT,
    family_circumstance TEXT,
    support_need TEXT,
    support_history_old TEXT,
    evidence_image_url TEXT,
    support_type VARCHAR(255),
    processing_officer VARCHAR(255),
    coordinating_unit VARCHAR(255),
    updated_support_status VARCHAR(100),
    resolution_status VARCHAR(100) NOT NULL DEFAULT 'Mới tiếp nhận',
    result_note TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    donor_address TEXT,
    classification_type VARCHAR(100),
    custom_col15 TEXT,
    custom_col16 TEXT,
    object_or_type_need VARCHAR(255),
    ward_group VARCHAR(50),
    ward_name VARCHAR(100),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Nhật ký Lịch sử Hỗ trợ (Timeline tách bảng thay vì chuỗi gộp)
CREATE TABLE record_support_timelines (
    id SERIAL PRIMARY KEY,
    record_id VARCHAR(50) REFERENCES social_records(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    content TEXT NOT NULL,
    created_by_officer VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Nhà Tài Trợ & Đồng Hành
CREATE TABLE companion_donors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    gift_count INTEGER NOT NULL DEFAULT 0,
    donation_date VARCHAR(20),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo Chỉ mục (Indexes) để tối ưu tìm kiếm
CREATE INDEX idx_social_records_search ON social_records(full_name, cccd, phone, head_of_household);
CREATE INDEX idx_social_records_status ON social_records(resolution_status);
CREATE INDEX idx_social_records_category ON social_records(category);
CREATE INDEX idx_social_records_ward ON social_records(ward_name);
```

### 7.2. Các lưu ý nghiệp vụ cốt lõi khi Dựng lại Màn hình
1. **Bảo toàn giao diện Modal theo Vai trò (Role-based Modal layout):**
   * Đối với vai trò `CITIZEN`: Tuyệt đối không để lộ form chỉnh sửa; phải render layout dạng Timeline hiển thị các mốc thời gian và ảnh minh chứng.
   * Đối với vai trò `OFFICER`: Bắt buộc ẩn các trường quản trị nhạy cảm (`col4`, `addressStatus`, `objectOrTypeNeed`, `col15`, `col16`) để tránh rủi ro sai lệch dữ liệu phân loại.
   * Đối với vai trò `ADMIN`: Cung cấp đầy đủ quyền truy cập, chỉnh sửa toàn diện tất cả các cột và quyền quản lý danh sách tài khoản `/users`.
2. **Xử lý URL Ảnh Google Drive:**
   * Khi người dùng nhập link chia sẻ Google Drive (dạng `https://drive.google.com/file/d/{id}/view`), hệ thống cần tiếp tục sử dụng hàm `getValidImageUrl()` để render sang `https://lh3.googleusercontent.com/d/{id}=s800`, hoặc tốt nhất nên triển khai endpoint upload ảnh trực tiếp lên Cloud Storage (AWS S3, Google Cloud Storage, Cloudinary, MinIO) để đảm bảo tốc độ và độ bền vững liên kết.
3. **Thuật toán Bản đồ GIS Điểm & Cụm Phường:**
   * Khi chưa tích hợp dịch vụ Geocoding API có trả phí của Google Maps, cần duy trì thuật toán bóc tách địa chỉ `formatAddress` và bảng tọa độ tâm các phường kèm giải thuật phân tán điểm (Jittering) để bản đồ luôn hiển thị sống động, trực quan và không bị dồn cục vào tâm màn hình.
4. **Đồng bộ hóa 5 Liên kết Danh mục Đính kèm trên Sidebar:**
   * Giữ nguyên 5 link tài liệu Google Drive ngoại vi (Ds hộ nghèo, hộ cận nghèo, gia đình chính sách, bảo trợ xã hội, danh sách tặng quà) tại thanh điều hướng Sidebar để đảm bảo cán bộ có thể mở nhanh các file hồ sơ gốc khi cần đối chiếu.

---
*Tài liệu Low-Level Design (LLD) này được biên soạn đầy đủ, chi tiết, đảm bảo phản ánh 100% tính năng, trường dữ liệu và giao diện thực tế của dự án SocialCare Connect.*
