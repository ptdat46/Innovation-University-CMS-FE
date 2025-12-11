import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Nav from '../components/Navbar.jsx';
import ContentSection from '../components/ContentSection.jsx';
import banner from '../assets/banner.png';

export default function Homepage() {
    return (
        <div>
            <Nav />
            <div className="w-full overflow-hidden relative" style={{ height: '300px' }}>
                <img src={banner} alt="Banner" className="w-full h-full object-cover" style={{ objectPosition: '50% 30%' }} />
                <div className="absolute inset-0 flex flex-col justify-center pl-30" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                    <h1 className="text-white text-5xl font-bold mb-4">Chào mừng tới với</h1>
                    <h2 className="text-white text-5xl font-bold mb-6">Innovation University</h2>
                    <p className="text-white text-lg max-w-md">Đại học hàng đầu trong đào tạo nhân tài, nơi khơi dậy sáng tạo và đổi mới cho tương lai</p>
                </div>
            </div>

            {/* Divider */}
            <div className="h-1 bg-gray-300"></div>

            {/* Content Sections */}
            <ContentSection title="Tin tức & Thông báo" icon="📰" linkPath="/news" />
            <ContentSection title="Sự kiện & Marketing" icon="📢" linkPath="/events" />
            <ContentSection title="Hoạt động CLB" icon="🎭" linkPath="/clubs" />
            <ContentSection title="Đời sống Sinh viên" icon="🎓" linkPath="/student-life" />
        </div>
    );
}