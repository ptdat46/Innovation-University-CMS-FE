# Innovation University CMS - Frontend Portal

Giao diện người dùng (Client-side) của hệ thống quản lý đại học, được xây dựng bằng **ReactJS** và **Tailwind CSS**. Ứng dụng cung cấp trải nghiệm mượt mà (SPA) cho Sinh viên, Giảng viên và Quản trị viên tương tác với hệ thống.

## 🛠 Tech Stack (Công nghệ sử dụng)
*   **Core:** ReactJS (Vite/Create React App), JavaScript (ES6+)
*   **Styling:** Tailwind CSS (Utility-first CSS framework)
*   **Routing:** React Router DOM v6
*   **State Management:** React Context API / Redux Toolkit (tùy chọn trong code)
*   **HTTP Client:** Axios (Xử lý API requests & Interceptors)
*   **Icons:** React Icons / Heroicons

## 📂 Cấu trúc Dự ántext
Innovation-University-CMS-FE/
├── src/
│   ├── assets/          # Hình ảnh, fonts
│   ├── components/      # Các UI Components tái sử dụng (Button, Modal, Navbar...)
│   ├── pages/           # Các màn hình chính (LoginPage, Dashboard, CourseReg...)
│   ├── layouts/         # Bố cục trang (AdminLayout, StudentLayout)
│   ├── services/        # Cấu hình Axios và gọi API (authService, courseService...)
│   ├── context/         # AuthContext (Lưu trạng thái đăng nhập)
│   └── App.js           # Router chính
├── tailwind.config.js   # Cấu hình theme Tailwind
└── package.json         # Danh sách thư viện

## ✨ Chức năng Chính (Frontend Features)
### Dashboard:

Biểu đồ thống kê cho Admin.

Lịch học và thông báo cho Sinh viên.

Cổng Sinh viên:

Tra cứu điểm thi, lịch sử học tập.

Đăng ký môn học (Giao diện chọn lớp, xem sĩ số thực).

Cổng Giảng viên:

Quản lý danh sách lớp chủ nhiệm/giảng dạy.

Nhập điểm online.

### UI/UX:

Thiết kế Responsive (Mobile-friendly).

🚀 Hướng dẫn Cài đặt (Installation Guide)
Yêu cầu hệ thống
Node.js (Phiên bản LTS, khuyến nghị v20)

NPM hoặc Yarn

Bước 1: Clone dự án
```
git clone [https://github.com/ptdat46/Innovation-University-CMS-FE.git](https://github.com/ptdat46/Innovation-University-CMS-FE.git)
cd Innovation-University-CMS-FE
```
Bước 2: Cài đặt thư viện (Dependencies)
```
npm install
# hoặc nếu dùng yarn:
yarn install
```
Bước 3: Cấu hình kết nối API
Tạo file .env tại thư mục gốc (ngang hàng package.json) để trỏ về Backend Laravel đang chạy:
```
# Dùng Vite
VITE_API_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
```
Bước 4: Khởi chạy ứng dụng (Development Mode)
```
npm run dev
Truy cập trình duyệt tại: http://localhost:5137 (hoặc port hiển thị trên terminal).
```
Lưu ý: Đảm bảo Backend Laravel đang chạy (php artisan serve) trước khi đăng nhập trên Frontend để tránh lỗi kết nối mạng.
