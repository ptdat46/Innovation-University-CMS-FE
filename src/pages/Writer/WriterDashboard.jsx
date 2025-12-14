import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, removeAuthToken } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

export default function WriterDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth('writer');

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPostIds, setSelectedPostIds] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/writer/posts');
            
            if (response.success) {
                setPosts(response.data.posts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPost = (postId) => {
        setSelectedPostIds(prev => {
            if (prev.includes(postId)) {
                return prev.filter(id => id !== postId);
            } else {
                return [...prev, postId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedPostIds(posts.map(post => post.id));
        } else {
            setSelectedPostIds([]);
        }
    };

    const handleDeleteClick = () => {
        if (selectedPostIds.length === 0) return;
        setShowDeleteDialog(true);
    };

    const handleDeletePosts = async () => {
        setDeleting(true);
        try {
            const deletePromises = selectedPostIds.map(postId =>
                api.delete(`/writer/posts/${postId}`)
            );
            
            await Promise.all(deletePromises);
            
            setShowDeleteDialog(false);
            setSelectedPostIds([]);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting posts:', error);
        } finally {
            setDeleting(false);
        }
    };

    const handleLogout = async () => {
        await api.post('/writer/logout');
        removeAuthToken();
        navigate('/writer/login');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        if (status === 'posted') {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Đã đăng</span>;
        }
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Chờ duyệt</span>;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-green-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Writer Dashboard</h1>
                        <p className="text-green-200 text-sm">Xin chào, {user?.name || 'Writer'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded-lg transition"
                    >
                        Đăng xuất
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Bài viết của tôi ({posts.length} bài)
                        </h2>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteClick}
                                disabled={selectedPostIds.length === 0}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Xóa ({selectedPostIds.length})
                            </button>
                            <button
                                onClick={() => navigate('/writer/posts/create')}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                            >
                                + Tạo bài viết
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <p className="mt-2 text-gray-600">Đang tải...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Bạn chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedPostIds.length === posts.length && posts.length > 0}
                                                onChange={handleSelectAll}
                                                className="rounded"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tiêu đề
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lượt xem
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lượt thích
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày tạo
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPostIds.includes(post.id)}
                                                    onChange={() => handleSelectPost(post.id)}
                                                    className="rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer" onClick={() => navigate(`/${post.category}/post/${post.id}`)}>
                                                #{post.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 cursor-pointer" onClick={() => navigate(`/${post.category}/post/${post.id}`)}>
                                                <div className="max-w-md truncate font-medium">
                                                    {post.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => navigate(`/${post.category}/post/${post.id}`)}>
                                                {getStatusBadge(post.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 cursor-pointer" onClick={() => navigate(`/${post.category}/post/${post.id}`)}>
                                                {post.views?.toLocaleString() || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 cursor-pointer" onClick={() => navigate(`/${post.category}/post/${post.id}`)}>
                                                {post.likes?.toLocaleString() || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer" onClick={() => navigate(`/${post.category}/post/${post.id}`)}>
                                                {formatDate(post.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Xác nhận xóa bài viết
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa {selectedPostIds.length} bài viết đã chọn không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeletePosts}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {deleting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang xóa...
                                    </>
                                ) : (
                                    'Xóa'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
