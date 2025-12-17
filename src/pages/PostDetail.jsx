import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api, getAuthToken } from '../utils/api';
import Nav from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import EditorJsRenderer from '../components/EditorJsRenderer.jsx';
import banner from '../assets/big-banner.png';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [viewsCount, setViewsCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    
    const isWriterRoute = location.pathname.startsWith('/writer');
    const token = getAuthToken();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('Post ID from URL:', id);
                const url = isWriterRoute ? `/writer/posts/${id}` : `/posts/${id}`;
                console.log('API URL:', url);
                const response = await api.get(url);
                console.log('Post detail response:', response.data);
                const postData = response.data.post;
                setPost(postData);
                console.log('Post ID:', postData.id, 'Post likes:', postData.likes, 'Post views:', postData.views);
                setLikesCount(postData.likes || 0);
                setViewsCount(postData.views || 0);
                setLiked(response.data.liked || false);
                
                // Tự động tăng view nếu có token
                if (token && !isWriterRoute) {
                    const viewResponse = await api.post(`/posts/${id}/view`);
                    if (viewResponse.data.views !== undefined) {
                        setViewsCount(viewResponse.data.views);
                    }
                }
                
                // Lấy comments
                const commentsRes = await api.get(`/posts/${id}/comments`);
                setComments(commentsRes.data.comments || []);
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
    }, [id, isWriterRoute, token]);

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

    const handleLike = async () => {
        if (!token) {
            alert('Vui lòng đăng nhập để thích bài viết');
            return;
        }
        
        try {
            const response = await api.post(`/posts/${id}/like`);
            setLiked(response.data.liked);
            setLikesCount(response.data.likes);
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!token) {
            alert('Vui lòng đăng nhập để bình luận');
            return;
        }
        
        if (!newComment.trim()) return;
        
        setSubmittingComment(true);
        try {
            const response = await api.post(`/posts/${id}/comments`, {
                content: newComment.trim()
            });
            setComments([response.data.comment, ...comments]);
            setNewComment('');
        } catch (err) {
            console.error('Error posting comment:', err);
            alert('Không thể gửi bình luận');
        } finally {
            setSubmittingComment(false);
        }
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
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#c9151b]"></div>
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
                                <span className="bg-[#c9151b] text-white text-sm font-bold px-3 py-1 rounded uppercase">
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
                            <div className="bg-[#fde9e9] border-l-4 border-[#c9151b] p-4 mb-6">
                                <p className="text-gray-700 italic">{post.excerpt}</p>
                            </div>
                        )}

                        {/* Post Content */}
                        <div className="prose prose-lg max-w-none">
                            <EditorJsRenderer data={post.content} />
                        </div>

                        {/* Like and View Stats */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={handleLike}
                                        disabled={!token}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                                            liked 
                                                ? 'bg-red-500 text-white hover:bg-red-600' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <span className="text-xl">{liked ? '❤️' : '🤍'}</span>
                                        <span className="font-semibold">{likesCount} Thích</span>
                                    </button>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="text-xl">👁️</span>
                                        <span className="font-semibold">{viewsCount} Lượt xem</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Bình luận ({comments.length})
                            </h2>

                            {/* Comment Form */}
                            {token ? (
                                <form onSubmit={handleSubmitComment} className="mb-8">
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-[#c9151b] flex items-center justify-center text-white font-semibold">
                                                {user?.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Viết bình luận..."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9151b] focus:border-transparent resize-none"
                                                rows="3"
                                            />
                                            <div className="mt-2 flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={submittingComment || !newComment.trim()}
                                                    className="px-6 py-2 bg-[#c9151b] text-white rounded-lg hover:bg-[#a01318] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                    <p className="text-gray-600">
                                        Vui lòng{' '}
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="text-[#c9151b] hover:text-[#a01318] font-semibold"
                                        >
                                            đăng nhập
                                        </button>
                                        {' '}để bình luận
                                    </p>
                                </div>
                            )}

                            {/* Comments List */}
                            <div className="space-y-6">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                                                    {comment.user?.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="font-semibold text-gray-900">
                                                        {comment.user?.name || 'User'}
                                                    </p>
                                                    <p className="text-gray-700 mt-1">{comment.content}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 ml-4">
                                                    {new Date(comment.created_at).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-8">
                                        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </article>

                {/* Back Button at Bottom */}
                <div className="mt-8 text-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-[#c9151b] text-white px-8 py-3 rounded-lg hover:bg-[#a01318] transition font-semibold"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
