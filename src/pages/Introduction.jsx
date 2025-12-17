import Nav from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import heroBanner from '../assets/introductionHeroBanner.png';

export default function Introduction() {
    return (
        <div className="min-h-screen bg-[#f7f3ef]">
            <Nav />

            {/* Hero Banner */}
            <div className="relative text-white" style={{ backgroundImage: `url(${heroBanner})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 className="text-5xl font-bold">TỔNG QUAN HỌC VIỆN</h1>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Overview Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-[#1f2933] mb-6 border-l-4 border-[#c9151b] pl-4">
                        Tổng quan
                    </h2>
                    <div className="space-y-4 text-[#4b5563] leading-relaxed text-lg">
                        <p>
                            Innovation University là cơ sở đào tạo chất lượng cao, chuyên đào tạo nguồn nhân lực trong lĩnh vực công nghệ số, khoa học máy tính và kỹ thuật điện tử viễn thông. Trường hướng đến việc xây dựng một môi trường học thuật hiện đại, năng động, nơi sinh viên được khuyến khích sáng tạo, phát triển tư duy phản biện và kỹ năng thực hành.
                        </p>
                        <p>
                            Với đội ngũ giảng viên giàu kinh nghiệm, tâm huyết và trình độ cao, cùng hệ thống cơ sở vật chất tiên tiến, nhà trường cam kết mang đến môi trường học tập tốt nhất cho sinh viên. Các chương trình đào tạo nghiêm, trung tâm nghiên cứu và hệ thống học liệu được cập nhật liên tục từ những tri thức tiên tiến nhất trên thế giới.
                        </p>
                        <p>
                            Trường không ngừng đổi mới chương trình đào tạo, cập nhật theo xu hướng công nghệ toàn cầu, đồng thời mở rộng hợp tác với các doanh nghiệp, tổ chức trong và ngoài nước để tạo ra những cơ hội thực tập, việc làm sau tốt nghiệp cho sinh viên.
                        </p>
                        <p>
                            Với sứ mệnh đào tạo thế hệ nhân tài hội nhập quốc tế, các khoa học này đã góng nghiêp xứ thuật để đảng trong bước khẳng định vị thế là một trong những đơn vị tiên phong trong đào tạo nguồn nhân lực công nghệ cao, đáp ứng yêu cầu chuyển đổi số và phát triển kinh tế tri thức của đất nước.
                        </p>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="mb-16">
                    <div className="bg-white rounded-2xl shadow-lg p-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="space-y-3">
                                <div className="flex justify-center mb-3">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="text-3xl">👥</span>
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-[#c9151b]">5000+</p>
                                <p className="text-sm font-semibold text-[#4b5563]">Sinh viên</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-center mb-3">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="text-3xl">🎓</span>
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-[#c9151b]">15+</p>
                                <p className="text-sm font-semibold text-[#4b5563]">Ngành đào tạo</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-center mb-3">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="text-3xl">📚</span>
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-[#c9151b]">95%</p>
                                <p className="text-sm font-semibold text-[#4b5563]">Tỷ lệ việc làm</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-center mb-3">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="text-3xl">🏢</span>
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-[#c9151b]">2</p>
                                <p className="text-sm font-semibold text-[#4b5563]">Cơ sở đào tạo</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Facilities Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-[#1f2933] mb-8 border-l-4 border-[#c9151b] pl-4">
                        Cơ sở vật chất
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">🔬</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#c9151b] mb-3">Phòng thí nghiệm</h3>
                                    <p className="text-[#4b5563]">
                                        Hệ thống phòng lab hiện đại với thiết bị công nghệ tiên tiến phục vụ thực hành.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">📖</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#c9151b] mb-3">Thư viện</h3>
                                    <p className="text-[#4b5563]">
                                        Thư viện rộng 2000m² với hơn 50,000 đầu sách và tài liệu điện tử.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">🏠</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#c9151b] mb-3">Ký túc xá</h3>
                                    <p className="text-[#4b5563]">
                                        Ký túc xá hiện đại, đầy đủ tiện nghi với sức chứa 1000 sinh viên.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">⚽</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#c9151b] mb-3">Sân thể thao</h3>
                                    <p className="text-[#4b5563]">
                                        Sân bóng đá, bóng rổ, và khu tập gym hiện đại cho sinh viên.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}
