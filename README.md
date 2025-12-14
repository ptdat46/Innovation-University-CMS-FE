# Innovation University - Frontend

Frontend React + Vite hiển thị tin tức/bài viết và dashboard.

## Yêu cầu
- Node.js >= 18
- npm hoặc pnpm

## Cài đặt & chạy
```bash
cd Frontend
npm install
npm run dev
```
Mặc định Vite chạy tại http://localhost:5173.

Cấu hình API base URL trong `src/utils/apiClient.js` (hoặc dùng `.env` với `VITE_API_BASE_URL`). Đảm bảo backend chạy `http://localhost:8000` hoặc cập nhật lại.

## Scripts
- `npm run dev`: chạy development server

## Tài khoản mẫu (phù hợp backend seeder)
- Admin: username `admin` / password `password`
- Writer: username `writer` / password `password`
- User: username `user` / password `password`

## Chức năng chính UI
- Đăng nhập, lưu token, phân quyền (Admin/Writer/User)
- Trang chủ và trang category: news, events, clubs, student-life
- Chi tiết bài viết: render nội dung Editor.js, đếm view, like/unlike, hiển thị và tạo bình luận
- Dashboard: thống kê số bài, lượt xem, lượt thích
- Writer: tạo/xoá bài viết, upload nội dung bài viết (thêm ảnh thumbnail, ảnh trong nội dung vào bài viết)
- Admin: duyệt bài pendingm, xoá các bài viết không phù hợp

## Cấu trúc thư mục
```
src/
  pages/        # Home, Category, Dashboard, PostDetail, Auth...
  components/   # Card, Layout, ProtectedRoute, Editor renderers...
  hooks/        # Kiểm tra role, token của user.
  utils/        # apiClient, auth helpers
  assets/       # logo, styles
```

