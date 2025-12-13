import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Nav from '../components/Navbar.jsx';
import HorizontalPostCard from '../components/HorizontalPostCard.jsx';
import banner from '../assets/big-banner.png';

export default function StudentLife() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    const fetchPosts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/student-life?page=${page}`);
            // Structure: response.data.posts is the paginator object
            const postsData = response.data.posts;
            
            setPosts(postsData.data || []);
            setPagination({
                current_page: postsData.current_page,
                last_page: postsData.last_page,
                total: postsData.total
            });
        } catch (error) {
            console.error('Error fetching student life posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(1);
    }, []);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page) {
            fetchPosts(page);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="min-h-screen relative">
            <Nav />
            
            {/* Fixed Background */}
            <div className="fixed inset-0 z-[-1]">
                <img 
                    src={banner} 
                    alt="Background" 
                    className="w-full h-full object-cover filter blur-sm brightness-50" 
                />
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
                <div className="mb-8 text-white">
                    <h1 className="text-3xl font-bold border-l-4 border-blue-500 pl-4">
                        Đời sống Sinh viên
                    </h1>
                    <p className="mt-2 pl-5 text-gray-200">
                        Những câu chuyện và trải nghiệm thú vị của sinh viên Innovation University
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <HorizontalPostCard key={post.id} post={post} />
                                ))
                            ) : (
                                <p className="text-center text-gray-200 py-10">Chưa có bài viết nào.</p>
                            )}
                        </div>

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-center mt-10 space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className={`px-4 py-2 rounded border ${
                                        pagination.current_page === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Trước
                                </button>
                                
                                {[...Array(pagination.last_page)].map((_, index) => {
                                    const page = index + 1;
                                    // Show first, last, current, and neighbors
                                    if (
                                        page === 1 ||
                                        page === pagination.last_page ||
                                        (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 rounded border ${
                                                    pagination.current_page === page
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (
                                        page === pagination.current_page - 2 ||
                                        page === pagination.current_page + 2
                                    ) {
                                        return <span key={page} className="px-2 py-2 text-white">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className={`px-4 py-2 rounded border ${
                                        pagination.current_page === pagination.last_page
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}