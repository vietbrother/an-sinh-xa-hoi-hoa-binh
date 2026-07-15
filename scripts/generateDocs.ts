import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  AlignmentType,
  WidthType
} from "docx";
import * as fs from "fs";
import * as path from "path";

// Ensure /doc directory exists
const docDir = path.join(process.cwd(), "doc");
if (!fs.existsSync(docDir)) {
  fs.mkdirSync(docDir, { recursive: true });
}

// Global Styling Constants
const FONT_SANS = "Arial";
const COLOR_PRIMARY = "0F172A"; // Slate 900
const COLOR_SECONDARY = "0ea5e9"; // Sky 500
const COLOR_TEXT = "334155"; // Slate 700
const COLOR_MUTED = "64748B"; // Slate 500

function createHeader(title: string, subtitle: string) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 40, // 20pt
          font: FONT_SANS,
          color: COLOR_PRIMARY,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text: subtitle,
          italic: true,
          size: 24, // 12pt
          font: FONT_SANS,
          color: COLOR_SECONDARY,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 480 },
      children: [
        new TextRun({
          text: "Hệ thống An sinh Xã hội Số - SocialCare Connect",
          bold: true,
          size: 18, // 9pt
          font: FONT_SANS,
          color: COLOR_MUTED,
        }),
      ],
    }),
  ];
}

function createHeading(text: string, level: any) {
  return new Paragraph({
    heading: level,
    spacing: { before: 240, after: 120 },
    keepWithNext: true,
    children: [
      new TextRun({
        text,
        bold: true,
        font: FONT_SANS,
        color: COLOR_PRIMARY,
      }),
    ],
  });
}

function createParagraph(text: string, options: { bold?: boolean; italic?: boolean; size?: number; color?: string; before?: number; after?: number } = {}) {
  return new Paragraph({
    spacing: { before: options.before ?? 60, after: options.after ?? 120 },
    lineSpacing: { before: 240, line: 360 }, // 1.5 Line spacing
    children: [
      new TextRun({
        text,
        bold: options.bold,
        italic: options.italic,
        size: options.size ?? 24, // 12pt default
        font: FONT_SANS,
        color: options.color ?? COLOR_TEXT,
      }),
    ],
  });
}

function createBulletPoint(boldPrefix: string, text: string) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 80 },
    lineSpacing: { line: 320 },
    children: [
      new TextRun({
        text: boldPrefix,
        bold: true,
        font: FONT_SANS,
        color: COLOR_PRIMARY,
      }),
      new TextRun({
        text: text,
        font: FONT_SANS,
        color: COLOR_TEXT,
      }),
    ],
  });
}

// ----------------------------------------------------------------------
// DOCUMENT 1: PRODUCT REQUIREMENT DOCUMENT (PRD)
// ----------------------------------------------------------------------
function generatePRD() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        ...createHeader("TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD)", "Product Requirement Document"),
        
        createHeading("1. GIỚI THIỆU DỰ ÁN (PROJECT OVERVIEW)", HeadingLevel.HEADING_1),
        createParagraph("SocialCare Connect là Hệ thống An sinh Xã hội Số được xây dựng nhằm mục tiêu chuyển đổi số toàn diện công tác quản lý, giám sát và phân bổ nguồn lực hỗ trợ cho các đối tượng chính sách, hộ nghèo, hộ cận nghèo và các gia đình có hoàn cảnh đặc biệt khó khăn tại địa phương."),
        createParagraph("Hệ thống giải quyết bài toán phức tạp về quản lý hộ tịch, địa giới hành chính sau khi sáp nhập các phường/xã, giúp kết nối trực tiếp cán bộ mặt trận, các nhà hảo tâm và chính quyền địa phương trên một nền tảng trực quan và đồng bộ dữ liệu thời gian thực."),
        
        createHeading("2. BỐI CẢNH & THÁCH THỨC THỰC TIỄN", HeadingLevel.HEADING_2),
        createParagraph("Trước khi có hệ thống, công tác quản lý an sinh xã hội đối mặt với nhiều khó khăn lớn:"),
        createBulletPoint("Xáo trộn địa giới hành chính: ", "Việc sáp nhập các phường (ví dụ: các tổ dân phố của các phường cũ sáp nhập vào phường mới) khiến việc định vị, quản lý địa chỉ hộ gia đình cực kỳ khó khăn nếu chỉ dùng sổ sách giấy."),
        createBulletPoint("Thất thoát và trùng lặp thông tin: ", "Dữ liệu phân tán ở nhiều file excel hoặc báo cáo giấy, dẫn đến tình trạng một hộ có thể nhận hỗ trợ nhiều lần từ các nhà hảo tâm khác nhau trong khi hộ khác lại bị bỏ sót."),
        createBulletPoint("Thiếu công cụ trực quan: ", "Cán bộ không có cái nhìn tổng quan về mật độ phân bố các hộ nghèo/cận nghèo trên bản đồ số để điều phối các đoàn cứu trợ, dẫn đến phân bổ nguồn lực không đồng đều."),
        createBulletPoint("Theo dõi tiến độ xử lý chậm trễ: ", "Quy trình từ lúc tiếp nhận nhu cầu của người dân đến lúc cán bộ xuống xác minh, liên kết đơn vị phối hợp và hoàn thành trao quà chưa được số hóa, khó kiểm tra trách nhiệm."),

        createHeading("3. MỤC TIÊU CỐT LÕI CỦA SẢN PHẨM", HeadingLevel.HEADING_2),
        createParagraph("Hệ thống SocialCare Connect hướng tới các mục tiêu chiến lược sau:"),
        createBulletPoint("Số hóa 100% hồ sơ an sinh: ", "Tất cả hồ sơ cứu trợ, an sinh xã hội được quản lý tập trung và an toàn trên nền tảng số."),
        createBulletPoint("Đồng bộ hóa 2 chiều thời gian thực: ", "Tích hợp trực tiếp với Google Sheets thông qua hệ thống Google Apps Script bảo mật, tối ưu hóa chi phí vận hành và tính dễ sử dụng cho cán bộ."),
        createBulletPoint("Trực quan hóa GIS bản đồ số: ", "Tự động phân tích địa chỉ cũ trước sáp nhập để đưa ra tọa độ địa lý, hiển thị mật độ hộ khó khăn trực quan trên bản đồ."),
        createBulletPoint("Quy trình xử lý khép kín: ", "Số hóa quy trình cập nhật thông tin hỗ trợ từ lúc tiếp nhận đến khi hoàn thành, tích hợp cơ chế lưu lịch sử dạng Timeline trực quan."),

        createHeading("4. ĐỐI TƯỢNG SỬ DỤNG & PHÂN QUYỀN (USER PERSONAS)", HeadingLevel.HEADING_1),
        createParagraph("Hệ thống được thiết kế tối ưu với 3 vai trò người dùng cụ thể:"),
        
        createParagraph("A. Quản trị viên hệ thống (ADMIN)", { bold: true, color: COLOR_PRIMARY }),
        createBulletPoint("Quyền hạn: ", "Toàn quyền quản lý hệ thống, cấu hình tham số, xem toàn bộ báo cáo phân tích trên Dashboard."),
        createBulletPoint("Nhiệm vụ: ", "Giám sát hiệu suất công việc của các cán bộ, kiểm tra tiến độ của các đơn vị phối hợp hỗ trợ, kết xuất dữ liệu báo cáo cấp cao."),
        
        createParagraph("B. Cán bộ thực hiện (OFFICER)", { bold: true, color: COLOR_PRIMARY }),
        createBulletPoint("Quyền hạn: ", "Xem danh sách hồ sơ, tìm kiếm nâng cao, cập nhật thông tin xử lý hồ sơ."),
        createBulletPoint("Nhiệm vụ: ", "Trực tiếp xuống địa bàn xác minh, cập nhật số điện thoại liên hệ, cập nhật hoàn cảnh khó khăn thực tế, cập nhật tình trạng hỗ trợ, phối hợp với các tổ chức chính trị xã hội và ghi nhật ký hỗ trợ mới nhất."),
        
        createParagraph("C. Người dân / Nhà hảo tâm (CITIZEN / DONOR)", { bold: true, color: COLOR_PRIMARY }),
        createBulletPoint("Quyền hạn: ", "Tra cứu công khai thông tin hồ sơ và bản đồ phân bổ an sinh để đảm bảo tính minh bạch."),
        createBulletPoint("Nhiệm vụ: ", "Nhập thông tin phản ánh nhu cầu hỗ trợ, theo dõi tiến trình xử lý hồ sơ của gia đình mình."),

        createHeading("5. YÊU CẦU TÍNH NĂNG CỐT LÕI (CORE REQUIREMENTS)", HeadingLevel.HEADING_1),
        
        createHeading("5.1. Bảng điều khiển phân tích thông minh (Dashboard)", HeadingLevel.HEADING_2),
        createBulletPoint("Chỉ số tổng hợp (Key Metrics): ", "Hiển thị Tổng số hồ sơ, Số hồ sơ đang xử lý, Số hồ sơ đã hoàn thành, Tỷ lệ hoàn thành (%), Thời gian xử lý trung bình."),
        createBulletPoint("Biểu đồ trực quan: ", "Biểu đồ cột phân bổ đối tượng khó khăn theo từng đơn vị Phường/Xã cũ; Biểu đồ hình quạt (Pie Chart) thể hiện tỷ lệ hoàn thành hỗ trợ."),
        createBulletPoint("Cập nhật thời gian thực: ", "Tích hợp trực tiếp dữ liệu từ Google Sheets, tự động cập nhật số liệu mới nhất khi có thay đổi trên Sheet."),
        createBulletPoint("Theo dõi trạng thái: ", "Thống kê tình trạng hỗ trợ mới của các hộ và danh sách nhật ký hoạt động gần đây nhất của các cán bộ địa bàn."),

        createHeading("5.2. Quản lý Danh sách Hồ sơ (Records List)", HeadingLevel.HEADING_2),
        createBulletPoint("Tìm kiếm đa thông tin: ", "Hỗ trợ tìm kiếm nhanh theo Họ tên chủ hộ, Số điện thoại, Số CCCD, Địa chỉ cũ."),
        createBulletPoint("Bộ lọc thông minh: ", "Lọc hồ sơ theo Phân loại đối tượng (Hộ nghèo, Cận nghèo, Khó khăn...), theo Trạng thái giải quyết (Mới tiếp nhận, Đang xử lý, Hoàn thành), và theo Tổ dân phố/Phường cũ."),
        createBulletPoint("Chỉ thị trực quan: ", "Các thẻ hồ sơ được phân biệt bằng màu sắc dựa trên Trạng thái giải quyết và Phân loại đối tượng để tăng khả năng nhận diện."),

        createHeading("5.3. Cập nhật Quy trình xử lý (Records Modal & Timeline)", HeadingLevel.HEADING_2),
        createBulletPoint("Form chi tiết hồ sơ: ", "Hiển thị đầy đủ thông tin nhân khẩu học, hộ khẩu, hoàn cảnh gia đình và nhu cầu hỗ trợ thực tế của hộ dân."),
        createBulletPoint("Cơ chế cập nhật an toàn: ", "Cho phép cán bộ cập nhật số điện thoại liên hệ, tình trạng hỗ trợ mới, cán bộ chịu trách nhiệm trực tiếp, cá nhân/đơn vị phối hợp, tình trạng giải quyết và kết quả xử lý."),
        createBulletPoint("Nhật ký Timeline: ", "Tự động phân tách và hiển thị lịch sử hỗ trợ mới thực hiện theo dạng dòng thời gian (timeline) chuyên nghiệp, dễ theo dõi tiến trình từ cũ đến mới."),

        createHeading("6. CHỈ SỐ THÀNH CÔNG (KEY PERFORMANCE INDICATORS - KPIs)", HeadingLevel.HEADING_1),
        createParagraph("Để đánh giá mức độ thành công của việc triển khai sản phẩm, hệ thống sử dụng các chỉ số đo lường sau:"),
        createBulletPoint("Độ chính xác dữ liệu: ", "100% dữ liệu đồng bộ không bị lệch pha giữa Google Sheets và ứng dụng."),
        createBulletPoint("Thời gian xử lý: ", "Giảm ít nhất 40% thời gian từ khi tiếp nhận nhu cầu đến khi hoàn thành hỗ trợ thực tế nhờ quy trình phối hợp số hóa."),
        createBulletPoint("Mức độ hài lòng của người dùng: ", "Giao diện dễ sử dụng, cán bộ địa phương chỉ mất tối đa 10 phút hướng dẫn là có thể làm chủ toàn bộ chức năng cập nhật và theo dõi."),
      ]
    }]
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(path.join(docDir, "PRD_SocialCare_Connect.docx"), buffer);
    console.log("Generated PRD_SocialCare_Connect.docx successfully!");
  });
}

// ----------------------------------------------------------------------
// DOCUMENT 2: SOFTWARE REQUIREMENT SPECIFICATION (SRS)
// ----------------------------------------------------------------------
function generateSRS() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        ...createHeader("TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)", "Software Requirement Specification"),
        
        createHeading("1. GIỚI THIỆU (INTRODUCTION)", HeadingLevel.HEADING_1),
        createParagraph("Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) này mô tả chi tiết các yêu cầu kỹ thuật, cấu trúc dữ liệu, kiến trúc hệ thống, các giao diện lập trình (API) và yêu cầu phi chức năng cho hệ thống SocialCare Connect."),
        createParagraph("Tài liệu được biên soạn làm cơ sở kỹ thuật cho đội ngũ phát triển sản phẩm, vận hành hệ thống và cấu hình đồng bộ dữ liệu với nền tảng Google Sheets."),

        createHeading("2. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (SYSTEM ARCHITECTURE)", HeadingLevel.HEADING_1),
        createParagraph("Hệ thống được xây dựng theo kiến trúc Web App Single Page Application (SPA) kết hợp Serverless Database Integration mang lại tốc độ vượt trội, khả năng mở rộng linh hoạt và tiết kiệm chi phí tối đa."),
        
        createBulletPoint("Công nghệ Frontend: ", "React JS (v19), Vite (v6) làm công cụ build, Tailwind CSS (v4) thiết kế giao diện responsive và tiện ích tối đa, Motion (v12) thực hiện các hiệu ứng chuyển động mượt mà."),
        createBulletPoint("Công cụ trực quan hóa dữ liệu: ", "Recharts (v3) hiển thị biểu đồ phân tích thống kê chuyên nghiệp; tích hợp bản đồ số GIS dựa trên tọa độ thực tế của từng Phường/Xã."),
        createBulletPoint("Công nghệ Backend & Database Engine: ", "Google Sheets API phối hợp cùng Google Apps Script (GAS) đóng vai trò là một RESTful Database Serverless. Toàn bộ thao tác CRUD (Create, Read, Update, Delete) được thực hiện thông qua giao thức HTTPS POST/GET với mã token an toàn."),

        createHeading("3. ĐẶC TẢ DỮ LIỆU & PAYLOAD PHỐI HỢP (DATA SPECIFICATION)", HeadingLevel.HEADING_1),
        createParagraph("Để đảm bảo tính đồng bộ tuyệt đối giữa Google Sheets và ứng dụng, cấu trúc dữ liệu của một bản ghi SocialRecord được chuẩn hóa như sau:"),

        // Let's create a table for data specification!
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("Trường dữ liệu (JSON)", { bold: true })], width: { size: 25, type: WidthType.PERCENTAGE } }),
                new TableCell({ children: [createParagraph("Cột tương ứng trên Google Sheets", { bold: true })], width: { size: 35, type: WidthType.PERCENTAGE } }),
                new TableCell({ children: [createParagraph("Kiểu dữ liệu", { bold: true })], width: { size: 15, type: WidthType.PERCENTAGE } }),
                new TableCell({ children: [createParagraph("Mô tả / Ý nghĩa", { bold: true })], width: { size: 25, type: WidthType.PERCENTAGE } }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("id")] }),
                new TableCell({ children: [createParagraph("ID")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Mã hồ sơ duy nhất (vd: ASXH001)")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("headOfHousehold")] }),
                new TableCell({ children: [createParagraph("Họ và tên chủ hộ")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Họ tên đầy đủ của chủ hộ gia đình")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("phone")] }),
                new TableCell({ children: [createParagraph("Số điện thoại / Số điện thọai")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("SĐT đăng ký ban đầu")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("contactPhone")] }),
                new TableCell({ children: [createParagraph("Số điện thoại liên hệ")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("SĐT liên lạc khẩn cấp mới cập nhật")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("birthDate")] }),
                new TableCell({ children: [createParagraph("Ngày tháng năm sinh")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Ngày sinh định dạng DD/MM/YYYY")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("cccd")] }),
                new TableCell({ children: [createParagraph("Số CCCD")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Số căn cước công dân 12 số")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("issuedDate")] }),
                new TableCell({ children: [createParagraph("Ngày cấp")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Ngày cấp CCCD")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("category")] }),
                new TableCell({ children: [createParagraph("Là đối tượng / Đối tượng")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Phân loại: Hộ nghèo, Cận nghèo...")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("addressStatus")] }),
                new TableCell({ children: [createParagraph("tình trạng hỗ trợ / tình trạng")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Tình hình nơi ở hoặc tình trạng hỗ trợ")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("oldAddress")] }),
                new TableCell({ children: [createParagraph("Địa chỉ cũ trước khi sáp nhập")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Tên tổ dân phố/phường cũ trước sáp nhập")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("residentAddress")] }),
                new TableCell({ children: [createParagraph("Hộ khẩu thường trú hiện nay")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Địa chỉ thường trú chi tiết")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("familyCircumstance")] }),
                new TableCell({ children: [createParagraph("Hoàn cảnh gia đình")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Mô tả chi tiết hoàn cảnh gia đình")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("supportNeed")] }),
                new TableCell({ children: [createParagraph("Nhu cầu hỗ trợ")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Đề xuất cứu trợ từ hộ dân")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("supportHistory")] }),
                new TableCell({ children: [createParagraph("Nhập Lịch sử hỗ trợ trước đây")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Thông tin hỗ trợ cũ trong lịch sử")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("supportType")] }),
                new TableCell({ children: [createParagraph("Cập nhật hình thức hỗ trợ")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Hình thức trao quà: Tiền mặt, Nhu yếu phẩm")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("supportHistoryNew")] }),
                new TableCell({ children: [createParagraph("Cập nhật Lịch sử hỗ trợ")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Nhật ký hỗ trợ mới (Được thiết kế Timeline)")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("processingOfficer")] }),
                new TableCell({ children: [createParagraph("Cán bộ thực hiện")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Tên cán bộ phụ trách trực tiếp")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("coordinatingUnit")] }),
                new TableCell({ children: [createParagraph("Cập nhật Cá nhân hoặc Đơn vị phối hợp")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Đơn vị phối hợp (MTTQ, Chữ thập đỏ...)")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("updatedSupportStatus")] }),
                new TableCell({ children: [createParagraph("Cập nhật tình trạng hỗ trợ")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Trạng thái hỗ trợ chi tiết hiện tại")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("resolutionStatus")] }),
                new TableCell({ children: [createParagraph("Cập nhật tình trạng giải quyết")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Mới tiếp nhận / Đang xử lý / Hoàn thành")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("result")] }),
                new TableCell({ children: [createParagraph("Cập nhật Kết quả xử lý")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Kết quả cụ thể sau khi hoàn thành")] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [createParagraph("completionTime")] }),
                new TableCell({ children: [createParagraph("Thời gian hoàn thành")] }),
                new TableCell({ children: [createParagraph("String")] }),
                new TableCell({ children: [createParagraph("Thời điểm hoàn thành công việc")] }),
              ]
            }),
          ]
        }),

        createHeading("4. ĐẶC TẢ CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)", HeadingLevel.HEADING_1),
        
        createHeading("4.1. Hệ thống Xác thực & Phân quyền", HeadingLevel.HEADING_2),
        createParagraph("Hệ thống quản lý phiên đăng nhập tại React sử dụng Context API (AuthContext.tsx) và lưu trạng thái vào LocalStorage để tránh mất phiên khi tải lại trang."),
        createBulletPoint("ADMIN (Mật khẩu: MttqHoaBinh@2026@admin): ", "Truy cập toàn bộ chức năng, có thể xem và sửa đổi tất cả các trường dữ liệu kể cả tình trạng của hộ gia đình."),
        createBulletPoint("OFFICER (Mật khẩu: MttqHoaBinh@2026@canbo): ", "Thực hiện nhiệm vụ cập nhật tình hình thực tế, bị ẩn hoặc khóa một số trường thuộc cấu hình hệ thống (như Tình trạng hộ gia đình được bảo vệ để tránh sửa đổi tùy ý)."),
        createBulletPoint("CITIZEN (Mật khẩu: 123): ", "Chế độ xem thông tin và tra cứu bản đồ địa hình, không có quyền chỉnh sửa dữ liệu."),

        createHeading("4.2. Đồng bộ hóa API Google Sheets (Integration Flow)", HeadingLevel.HEADING_2),
        createParagraph("Hệ thống giao tiếp với Google Sheets thông qua 2 cơ chế chính:"),
        createBulletPoint("Đọc dữ liệu (Read): ", "Sử dụng thư viện PapaParse để tải dữ liệu CSV đã được xuất bản công khai (Published) từ Google Sheets, giúp bỏ qua các rào cản CORS và tăng tốc độ tải trang xuống dưới 1.5 giây."),
        createBulletPoint("Ghi dữ liệu (Write): ", "Khi cán bộ cập nhật thông tin trong RecordsModal, ứng dụng gửi một yêu cầu HTTP POST có kèm Token bảo mật tới URL Web App của Google Apps Script. GAS sẽ tìm kiếm dòng chứa ID hồ sơ tương ứng và ghi đè dữ liệu mới lên các cột chính xác trên Google Sheets."),

        createHeading("4.3. Giải thuật Bản đồ GIS & Định vị địa giới cũ/mới", HeadingLevel.HEADING_2),
        createParagraph("Do địa chỉ cũ trước sáp nhập thường không có tọa độ GPS chính xác trên Google Maps API mặc định, hệ thống áp dụng cơ chế tự động phân tích cú pháp chuỗi địa chỉ (Address Parsing Engine):"),
        createBulletPoint("Bước 1: ", "Trích xuất tên phường cũ từ cột 'Địa chỉ cũ trước khi sáp nhập' (ví dụ: 'Phường Phương Lâm cũ', 'Phường Thịnh Lang cũ')."),
        createBulletPoint("Bước 2: ", "Ánh xạ tên phường vào bảng tọa độ trung tâm được định nghĩa sẵn trong hệ thống (Phương Lâm, Thịnh Lang, Hoà Bình, Khác)."),
        createBulletPoint("Bước 3: ", "Áp dụng thuật toán Random Jittering (thêm sai số nhỏ ngẫu nhiên +/- 0.005 độ vào vĩ độ và kinh độ) để phân tán các điểm hộ gia đình trên bản đồ, giúp hiển thị trực quan mật độ mà không bị chồng lấp các điểm trùng địa bàn."),

        createHeading("4.4. Giải thuật Phân tích Timeline Lịch sử Hỗ trợ", HeadingLevel.HEADING_2),
        createParagraph("Để quản lý lịch trình hỗ trợ phức tạp của nhiều đợt trao quà, cột 'Cập nhật Lịch sử hỗ trợ' (supportHistoryNew) lưu trữ các hoạt động phân tách bằng dấu xuống dòng và có cấu trúc thẻ thời gian dạng: `[DD/MM/YYYY] Nội dung hoạt động`."),
        createParagraph("Khi hiển thị trong modal chi tiết, hệ thống sử dụng Regex `\\n(?=\\[)` để bóc tách chuỗi văn bản thành mảng các sự kiện độc lập, sau đó dựng giao diện Timeline dạng cây dọc trực quan với các mốc thời gian nổi bật, biểu tượng trạng thái và liên kết đường nối liền mạch."),

        createHeading("5. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)", HeadingLevel.HEADING_1),
        createBulletPoint("Tính ổn định: ", "Ứng dụng phải hoạt động tốt trên môi trường mạng di động 3G/4G yếu để cán bộ tiện sử dụng ngay tại thực địa."),
        createBulletPoint("Tính phản hồi nhanh: ", "Thời gian hiển thị các biểu đồ Recharts và dữ liệu bản đồ dưới 1 giây sau khi dữ liệu thô được tải về thành công."),
        createBulletPoint("Độ tin cậy: ", "Cơ chế cập nhật dữ liệu phải có xử lý ngoại lệ (Exception Handling) tốt. Nếu cập nhật thất bại do lỗi mạng, hệ thống phải hiển thị thông báo chi tiết và giữ nguyên trạng thái form để cán bộ có thể thử lại mà không bị mất dữ liệu đã nhập."),
        createBulletPoint("Giao diện thích ứng (Responsive): ", "Tương thích 100% với màn hình điện thoại di động (Mobile Web) và máy tính bảng nhờ thiết kế cột linh hoạt của Tailwind CSS."),
      ]
    }]
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(path.join(docDir, "SRS_SocialCare_Connect.docx"), buffer);
    console.log("Generated SRS_SocialCare_Connect.docx successfully!");
  });
}

// ----------------------------------------------------------------------
// DOCUMENT 3: GIOI THIEU VA HUONG DAN SU DUNG (USER GUIDE)
// ----------------------------------------------------------------------
function generateIntro() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        ...createHeader("GIỚI THIỆU ỨNG DỤNG & HƯỚNG DẪN SỬ DỤNG", "SocialCare Connect - User Manual"),
        
        createHeading("1. GIỚI THIỆU CHUNG (APPLICATION INTRODUCTION)", HeadingLevel.HEADING_1),
        createParagraph("SocialCare Connect là Hệ thống An sinh Xã hội Số thông minh, được thiết kế chuyên biệt để giúp chính quyền địa phương, Ủy ban Mặt trận Tổ quốc và các tổ chức đoàn thể số hóa toàn bộ quy trình chăm sóc an sinh xã hội."),
        createParagraph("Với sự phối hợp đồng bộ giữa ứng dụng Web hiện đại và cơ sở dữ liệu linh hoạt trên Google Sheets, hệ thống mang đến giải pháp đột phá giúp theo dõi sát sao hoàn cảnh, nhu cầu và lịch sử nhận hỗ trợ của từng hộ dân, đảm bảo tiêu chí: ĐÚNG ĐỐI TƯỢNG - ĐÚNG NHU CẦU - KỊP THỜI - MINH BẠCH."),

        createHeading("2. QUY TRÌNH NGHIỆP VỤ AN SINH XÃ HỘI", HeadingLevel.HEADING_1),
        createParagraph("Quy trình nghiệp vụ của hệ thống bao gồm 4 bước khép kín và tự động hóa:"),
        createBulletPoint("Bước 1: Tiếp nhận nhu cầu ", "Thông tin nhu cầu hỗ trợ của các hộ dân được ghi nhận thông qua khảo sát hoặc do người dân khai báo trực tiếp lên Google Sheets."),
        createBulletPoint("Bước 2: Phân công & Khảo sát thực địa ", "Cán bộ địa bàn (OFFICER) đăng nhập ứng dụng, tiếp nhận hồ sơ mới, trực tiếp xuống khảo sát thực tế tại hộ gia đình."),
        createBulletPoint("Bước 3: Cập nhật & Phối hợp hỗ trợ ", "Cán bộ cập nhật số điện thoại liên hệ mới nhất, hoàn cảnh thực tế, liên kết với các cá nhân/đơn vị tài trợ phối hợp (MTTQ, Chữ thập đỏ, Nhà hảo tâm), ghi nhận hình thức hỗ trợ và cập nhật tiến trình xử lý."),
        createBulletPoint("Bước 4: Hoàn thành & Ghi nhật ký ", "Khi việc trao hỗ trợ thành công, cán bộ cập nhật kết quả xử lý và ghi thêm ghi chú mới vào Lịch sử hỗ trợ. Hệ thống tự động lưu trữ ghi chú này vào dòng thời gian (Timeline) và đồng bộ trực tiếp lên hệ thống biểu đồ báo cáo Dashboard."),

        createHeading("3. HƯỚNG DẪN SỬ DỤNG CHI TIẾT THEO VAI TRÒ", HeadingLevel.HEADING_1),
        
        createHeading("3.1. Dành cho Người dân & Nhà hảo tâm (Chế độ Xem công khai)", HeadingLevel.HEADING_2),
        createParagraph("Người dân có thể sử dụng hệ thống để tra cứu thông tin hỗ trợ một cách minh bạch:"),
        createBulletPoint("Tra cứu hồ sơ: ", "Tại trang Danh sách hồ sơ, nhập Họ tên chủ hộ, Số điện thoại hoặc Số CCCD vào ô tìm kiếm để kiểm tra thông tin cứu trợ của hộ mình."),
        createBulletPoint("Xem bản đồ an sinh: ", "Xem mật độ các hộ khó khăn trên bản đồ GIS trực quan tại địa bàn phường xã để biết các khu vực nào đang được tập trung hỗ trợ."),

        createHeading("3.2. Dành cho Cán bộ thực hiện (OFFICER)", HeadingLevel.HEADING_2),
        createParagraph("Cán bộ địa bàn sử dụng tài khoản để cập nhật thông tin cứu trợ thực tế:"),
        createBulletPoint("Đăng nhập hệ thống: ", "Nhấn vào nút Đăng nhập ở thanh điều hướng, nhập Tài khoản cán bộ và Mật khẩu (MttqHoaBinh@2026@canbo) để bắt đầu làm việc."),
        createBulletPoint("Tìm kiếm hồ sơ cần hỗ trợ: ", "Sử dụng bộ lọc theo Trạng thái giải quyết (ví dụ: 'Mới tiếp nhận' hoặc 'Đang xử lý') để hiển thị các hộ gia đình cần khảo sát hoặc hỗ trợ gấp."),
        createBulletPoint("Cập nhật thông tin thực tế: ", "Nhấn vào nút 'Xử lý' trên thẻ hồ sơ. Trong hộp thoại hiển thị, cập nhật các trường quan trọng: Số điện thoại liên hệ thực tế, Hộ khẩu hiện nay, Hoàn cảnh gia đình, Nhu cầu hỗ trợ."),
        createBulletPoint("Cập nhật nhật ký Timeline hỗ trợ: ", "Tại phần 'Lịch sử hỗ trợ mới thực hiện', nhập diễn biến hỗ trợ mới nhất (ví dụ: '[14/07/2026] Đã trao tận tay 1 thùng mì tôm và 500.000đ từ nhà hảo tâm ABC'). Nhấn nút 'Lưu cập nhật' để lưu dữ liệu trực tiếp lên Google Sheets."),

        createHeading("3.3. Dành cho Quản trị viên (ADMIN)", HeadingLevel.HEADING_2),
        createParagraph("Quản trị viên sử dụng tài khoản hệ thống để giám sát toàn diện hoạt động:"),
        createBulletPoint("Đăng nhập hệ thống: ", "Đăng nhập bằng tài khoản Quản trị viên và Mật khẩu (MttqHoaBinh@2026@admin)."),
        createBulletPoint("Giám sát chỉ số thông minh trên Dashboard: ", "Theo dõi tổng thể tỷ lệ hoàn thành hỗ trợ, thời gian xử lý trung bình của cán bộ, số lượng hồ sơ được cập nhật số điện thoại liên hệ đầy đủ."),
        createBulletPoint("Theo dõi mức độ phối hợp: ", "Xem biểu đồ thống kê đóng góp của từng đơn vị phối hợp (ví dụ: UBND phường, Chữ thập đỏ, cá nhân tài trợ) để tối ưu công tác vận động cứu trợ."),
        createBulletPoint("Duyệt thông tin nhạy cảm: ", "Kiểm soát và duyệt các thay đổi về Tình trạng của hộ gia đình (trường dữ liệu bị khóa đối với tài khoản cán bộ thông thường)."),

        createHeading("4. HƯỚNG DẪN TÍCH HỢP GOOGLE SHEETS & GOOGLE APPS SCRIPT", HeadingLevel.HEADING_1),
        createParagraph("Để cấu hình hệ thống đồng bộ với tệp Google Sheets mới của địa phương, thực hiện theo hướng dẫn sau:"),
        createBulletPoint("Bước 1: Tạo tệp Google Sheets ", "Tạo một file Google Sheets mới và thiết lập dòng tiêu đề (Dòng 1) chứa chính xác các cột như trong Tài liệu đặc tả SRS."),
        createBulletPoint("Bước 2: Triển khai Google Apps Script ", "Nhấn vào Tiện ích mở rộng -> Apps Script trên Google Sheets. Dán mã code Apps Script của hệ thống vào, thiết lập mã Token bảo mật đúng bằng 'AnSinhXaHoi@2026'."),
        createBulletPoint("Bước 3: Triển khai Web App ", "Nhấn vào nút 'Triển khai' -> 'Triển khai mới' trên trang Apps Script. Chọn loại triển khai là 'Ứng dụng web'. Thiết lập quyền truy cập là 'Bất kỳ ai' (Anyone). Sao chép URL Web App được cấp."),
        createBulletPoint("Bước 4: Cập nhật URL trên ứng dụng ", "Mở file '/src/pages/RecordsList.tsx' trong mã nguồn và dán URL Web App vừa sao chép vào hằng số 'YOUR_GAS_URL'."),
      ]
    }]
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(path.join(docDir, "Gioi_Thieu_SocialCare_Connect.docx"), buffer);
    console.log("Generated Gioi_Thieu_SocialCare_Connect.docx successfully!");
  });
}

// Execute generator
try {
  generatePRD();
  generateSRS();
  generateIntro();
} catch (e) {
  console.error("Error generating documents:", e);
}
