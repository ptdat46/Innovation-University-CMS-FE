import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Nav from '../components/Navbar.jsx';
import EditorJsRenderer from '../components/EditorJsRenderer.jsx';
import banner from '../assets/big-banner.png';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/posts/${id}`);
                setPost(response.data.post);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(err.response?.data?.message || 'Không thể tải bài viết');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'news': 'Tin tức',
            'events': 'Sự kiện',
            'clubs': 'CLB',
            'student-life': 'Đời sống sinh viên'
        };
        return labels[category] || category;
    };

    if (loading) {
        return (
            <div className="min-h-screen relative">
                <Nav />
                <div className="fixed inset-0 z-[-1]">
                    <img 
                        src={banner} 
                        alt="Background" 
                        className="w-full h-full object-cover filter blur-sm brightness-50" 
                    />
                </div>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen relative">
                <Nav />
                <div className="fixed inset-0 z-[-1]">
                    <img 
                        src={banner} 
                        alt="Background" 
                        className="w-full h-full object-cover filter blur-sm brightness-50" 
                    />
                </div>
                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-red-800 mb-2">Lỗi</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                            onClick={() => navigate(-1)}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen relative">
                <Nav />
                <div className="fixed inset-0 z-[-1]">
                    <img 
                        src={banner} 
                        alt="Background" 
                        className="w-full h-full object-cover filter blur-sm brightness-50" 
                    />
                </div>
                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <p className="text-center text-white text-xl">Bài viết không tồn tại</p>
                </div>
            </div>
        );
    }

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

            {/* Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-6 text-white hover:text-gray-300 flex items-center transition"
                >
                    <span className="mr-2">←</span> Quay lại
                </button>

                {/* Post Container */}
                <article className="bg-white rounded-lg shadow-xl overflow-hidden">
                    {/* Featured Image */}
                    {post.featured_image && (
                        <div className="w-full h-96 relative">
                            <img 
                                src={post.featured_image} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded uppercase">
                                    {getCategoryLabel(post.category)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Post Header */}
                    <div className="p-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {post.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6 pb-6 border-b border-gray-200">
                            <span className="mr-6">📅 {formatDate(post.post_day)}</span>
                            {post.views !== undefined && <span className="mr-6">👁️ {post.views} lượt xem</span>}
                            {post.likes !== undefined && <span className="mr-6">❤️ {post.likes} thích</span>}
                        </div>

                        {/* Excerpt */}
                        {post.excerpt && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                <p className="text-gray-700 italic">{post.excerpt}</p>
                            </div>
                        )}

                        {/* Post Content */}
                        <div className="prose prose-lg max-w-none">
                            <EditorJsRenderer data={post.content} />
                        </div>
                    </div>
                </article>

                {/* Back Button at Bottom */}
                <div className="mt-8 text-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        </div>
    );
}
