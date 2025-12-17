import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import Nav from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ContentSection from '../components/ContentSection.jsx';
import banner from '../assets/banner.png';
import bannerIcon from '../assets/icon-on-banner.png';
import fallbackThumb from '../assets/xemtin1.png';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2..png';

export default function Homepage() {
    const [news, setNews] = useState([]);
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [studentLife, setStudentLife] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/');
                const postsData = response.data.posts || {};
                setNews(postsData.news || []);
                setEvents(postsData.events || []);
                setClubs(postsData.clubs || []);
                setStudentLife(postsData.student_life || []);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="bg-[#f7f3ef] text-[#1f2933]">
            <Nav />

            {/* Hero */}
            <div className="relative text-white" style={{ backgroundImage: `url(${banner})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '520px' }}>
                <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-full relative flex flex-col items-center justify-center">
                    <div className="flex-1 space-y-5 text-center max-w-2xl mt-2">
                        <p className="text-sm uppercase tracking-[0.2em] font-semibold text-white/80">Tuyển sinh năm 2025</p>
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            Đăng ký xét tuyển trực tuyến
                            <span className="block mt-2 text-white">Nhận học bổng đến 100%</span>
                        </h1>
                        <p className="text-white/90 text-lg">
                            Đăng ký tư vấn ngay để không bỏ lỡ cơ hội trở thành sinh viên của Innovation University.
                        </p>
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <Link
                                to="/events"
                                className="inline-flex items-center bg-white text-[#c9151b] font-semibold px-5 py-3 rounded-md shadow hover:shadow-lg transition"
                            >
                                Đăng ký tư vấn ngay →
                            </Link>
                            <Link
                                to="/news"
                                className="inline-flex items-center text-white font-semibold border border-white/70 px-5 py-3 rounded-md hover:bg-white/10 transition"
                            >
                                Xem thêm tin tức
                            </Link>
                        </div>
                        <div className="flex gap-6 text-sm text-white/90 pt-2 justify-center">
                            <span>Giáo dục thực tế</span>
                            <span>Hội nhập quốc tế</span>
                            <span>Cơ hội việc làm cao</span>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0">
                    <img src={bannerIcon} alt="Student illustration" className="w-80 lg:w-[360px] object-contain" />
                </div>
            </div>

            {/* Intro */}
            <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-14">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div className="space-y-4">
                        <p className="text-sm font-semibold text-[#c9151b] uppercase">Innovation University</p>
                        <h2 className="text-3xl lg:text-4xl font-bold leading-snug">
                            Định hướng ứng dụng, tiên phong trong đào tạo công nghệ số và kỹ thuật hiện đại
                        </h2>
                        <p className="text-lg text-[#4b5563] leading-relaxed">
                            Với hơn 70 năm hình thành và phát triển, Trường Đại học Công nghệ và Đổi mới đã khẳng định vị thế là một trung tâm đào tạo uy tín trong các lĩnh vực công nghệ số như Khoa học Máy tính, Trí tuệ Nhân tạo, Kỹ thuật Dữ liệu, Công nghệ Vi mạch, Truyền thông Đa phương tiện, Tự động hóa thông minh, Điện tử – Viễn thông, và Hệ thống nhúng.
                        </p>
                        <p className="text-[#4b5563] leading-relaxed">
                            Trường đóng vai trò tổ chức lực lượng vững chắc góp phần nâng cao chất lượng cho các ngành công nghệ mới nổi, nhận được bình chọn là đơn vị được Nhà nước ưu tiên đầu tư và là nền tảng nghiên cứu, phát triển và chuyển giao công nghệ phục vụ chiến lược chuyển đổi số quốc gia.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/events" className="text-[#c9151b] font-semibold flex items-center">
                                Giáo dục thực tế ↗
                            </Link>
                            <Link to="/news" className="text-[#c9151b] font-semibold flex items-center">
                                Cơ hội việc làm cao ↗
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="rounded-xl overflow-hidden shadow-md bg-white">
                            <img src={image1} alt="Innovation University Lab 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="rounded-xl overflow-hidden shadow-md bg-white">
                            <img src={image2} alt="Innovation University Lab 2" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <ContentSection 
                title="Tin tức nổi bật" 
                subtitle="Tin tức sự kiện"
                linkPath="/news" 
                posts={news} 
                bgColor="bg-white"
                fallbackImage={fallbackThumb}
            />

            <ContentSection 
                title="Sự kiện nổi bật" 
                subtitle="Sự kiện"
                linkPath="/events" 
                posts={events} 
                bgColor="bg-[#f7f3ef]"
                fallbackImage={fallbackThumb}
            />

            <ContentSection 
                title="Hoạt động CLB" 
                subtitle="Câu lạc bộ"
                linkPath="/clubs" 
                posts={clubs} 
                bgColor="bg-white"
                fallbackImage={fallbackThumb}
            />

            <ContentSection 
                title="Đời sống sinh viên" 
                subtitle="Đời sống sinh viên"
                linkPath="/student-life" 
                posts={studentLife} 
                bgColor="bg-[#f7f3ef]"
                fallbackImage={fallbackThumb}
            />

            {/* Stats */}
            <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-14">
                <div className="bg-white rounded-2xl shadow-lg p-10 grid md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                    {[
                        { label: 'về Đề án tuyển sinh theo xếp hạng của Scimago năm 2024', value: '1', sub: '' },
                        { label: 'Chương trình đào tạo trình độ Đại học', value: '30+', sub: '' },
                        { label: 'Chương trình đào tạo Thạc sĩ và Tiến sĩ', value: '10', sub: '' },
                        { label: 'Văn phòng hợp tác nghiên cứu đào tạo. Liên kết đào tạo tại Nhật Bản và Hàn Quốc', value: '03', sub: '' },
                        { label: 'Cơ sở nghiên cứu, điều tra đặc biệt được Bệ Hộ quốc tế hoàn thiện tại Việt Nam', value: '07', sub: '' },
                        { label: 'Đối tác trong và ngoài nước', value: '400+', sub: '' }
                    ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                            <p className="text-3xl font-bold text-[#c9151b]">{item.value}</p>
                            <p className="text-sm font-semibold leading-snug">{item.label}</p>
                            {item.sub && <p className="text-xs text-[#6b7280]">{item.sub}</p>}
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
