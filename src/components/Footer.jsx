import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-[#e5e7eb] py-10">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-sm">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Innovation University" className="h-10" />
                        <div className="text-[#1f2933] font-bold">Innovation University</div>
                    </div>
                    <p className="font-semibold">Cơ sở đào tạo tại:</p>
                    <p>123 Đường Nguyễn Thiện, Quận 8, TP. HCM</p>
                </div>
                <div className="space-y-2">
                    <p className="font-semibold">Về chúng tôi</p>
                    <Link to="/" className="block text-[#4b5563] hover:text-[#c9151b]">Trang chủ</Link>
                    <Link to="/introduction" className="block text-[#4b5563] hover:text-[#c9151b]">Giới thiệu</Link>
                    <Link to="/news" className="block text-[#4b5563] hover:text-[#c9151b]">Tin tức</Link>
                    <Link to="/events" className="block text-[#4b5563] hover:text-[#c9151b]">Sự kiện</Link>
                    <Link to="/student-life" className="block text-[#4b5563] hover:text-[#c9151b]">Đời sống sinh viên</Link>
                </div>
                <div className="space-y-2">
                    <p className="font-semibold">Liên hệ</p>
                    <p>123 Đường Nguyễn Thiện, Quận 8, TP. Hồ Chí Minh</p>
                    <p>024 88 99 4885</p>
                    <p>tuyensinh@cokidcs.edu.vn</p>
                </div>
            </div>
            <div className="text-center text-xs text-[#6b7280] mt-6">© 2025 Innovation University. All Rights Reserved.</div>
        </footer>
    );
}
