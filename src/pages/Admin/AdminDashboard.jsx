import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, removeAuthToken, getCurrentUser } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth('admin');

    // States
    const [posts, setPosts] = useState([]);
    const [writers, setWriters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total_views: 0, total_likes: 0, total_posts: 0 });
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedPostIds, setSelectedPostIds] = useState([]);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [approving, setApproving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    // Filters
    const [filters, setFilters] = useState({
        status: 'all',
        category: 'all',
        writer_id: 'all',
        date_from: '',
        date_to: '',
    });

    const categories = [
        { value: 'all', label: 'Tất cả danh mục' },
        { value: 'news', label: 'Tin tức' },
        { value: 'events', label: 'Sự kiện' },
        { value: 'clubs', label: 'Câu lạc bộ' },
        { value: 'student-life', label: 'Đời sống sinh viên' },
    ];

    const statuses = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'pending', label: 'Chờ duyệt' },
        { value: 'posted', label: 'Đã đăng' },
    ];

    // Fetch writers list
    useEffect(() => {
        const fetchWriters = async () => {
            const response = await api.get('/admin/writers');
            if (response.success) {
                setWriters(response.data.writers);
            }
        };
        fetchWriters();
    }, []);

    // Fetch posts
    useEffect(() => {
        fetchPosts();
    }, [filters, pagination.current_page]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.current_page,
                per_page: 10,
                ...filters,
            });

            const response = await api.get(`/admin/posts?${params.toString()}`);
            
            if (response.success) {
                setPosts(response.data.posts);
                setPagination(response.data.pagination);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current_page: page }));
    };

    const handleSelectPost = (postId) => {
        // Chỉ cho select 1 bài viết để duyệt
        setSelectedPostId(postId);
        setShowApproveDialog(true);
    };

    const handleApprovePost = async () => {
        if (!selectedPostId) return;

        setApproving(true);
        try {
            const response = await api.get(`/admin/posts/${selectedPostId}/approve`);
            
            if (response.success) {
                fetchPosts();
                setShowApproveDialog(false);
                setSelectedPostId(null);
            }
        } catch (error) {
            console.error('Error approving post:', error);
        } finally {
            setApproving(false);
        }
    };

    const handleSelectPostForDelete = (postId) => {
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
                api.delete(`/admin/posts/${postId}`)
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
        await api.post('/admin/logout');
        removeAuthToken();
        navigate('/admin/login');
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

    const getCategoryLabel = (category) => {
        const cat = categories.find(c => c.value === category);
        return cat ? cat.label : category;
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, pagination.current_page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pagination.last_page, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded ${
                        pagination.current_page === i
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-center mt-6 space-x-2">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.current_page === 1}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    «
                </button>
                <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ‹
                </button>
                {pages}
                <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ›
                </button>
                <button
                    onClick={() => handlePageChange(pagination.last_page)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    »
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-red-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-red-200 text-sm">Xin chào, {user?.name || 'Admin'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg transition"
                    >
                        Đăng xuất
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-500 text-sm">Tổng bài viết</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_posts.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-500 text-sm">Tổng lượt xem</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_views.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-full">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-500 text-sm">Tổng lượt thích</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_likes.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Status Filter */}
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            {statuses.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>

                        {/* Category Filter */}
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            {categories.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>

                        {/* Writer Filter */}
                        <select
                            value={filters.writer_id}
                            onChange={(e) => handleFilterChange('writer_id', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả tác giả</option>
                            {writers.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>

                        {/* Date From */}
                        <input
                            type="date"
                            value={filters.date_from}
                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Từ ngày"
                        />

                        {/* Date To */}
                        <input
                            type="date"
                            value={filters.date_to}
                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Đến ngày"
                        />
                    </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Danh sách bài viết ({pagination.total} bài)
                        </h2>
                        <button
                            onClick={handleDeleteClick}
                            disabled={selectedPostIds.length === 0}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Xóa ({selectedPostIds.length})
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                            <p className="mt-2 text-gray-600">Đang tải...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Không tìm thấy bài viết nào
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
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                            Duyệt
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tiêu đề
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tác giả
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Danh mục
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
                                                    onChange={() => handleSelectPostForDelete(post.id)}
                                                    className="rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPostId === post.id}
                                                    onChange={() => handleSelectPost(post.id)}
                                                    disabled={post.status === 'posted'}
                                                    className="rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer" onClick={() => navigate(`/${post.category}/${post.id}`)}>
                                                #{post.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 cursor-pointer" onClick={() => navigate(`/${post.category}/${post.id}`)}>
                                                <div className="max-w-xs truncate font-medium">
                                                    {post.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 cursor-pointer" onClick={() => navigate(`/${post.category}/${post.id}`)}>
                                                {post.writer?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 cursor-pointer" onClick={() => navigate(`/${post.category}/${post.id}`)}>
                                                {getCategoryLabel(post.category)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => navigate(`/${post.category}/${post.id}`)}>
                                                {getStatusBadge(post.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 cursor-pointer" onClick={() => navigate(`/${post.category}/${post.id}`)}>
                                                {post.views?.toLocaleString() || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 cursor-pointer" onClick={() => navigate(`/${post.category}/${post.id}`)}>
                                                {post.likes?.toLocaleString() || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer" onClick={() => navigate(`/${post.category}/${post.id}`)}>
                                                {formatDate(post.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            {renderPagination()}
                        </div>
                    )}
                </div>
            </main>

            {/* Approve Dialog */}
            {showApproveDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Xác nhận duyệt bài viết
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn duyệt bài viết này không? Bài viết sẽ được công khai sau khi duyệt.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowApproveDialog(false);
                                    setSelectedPostId(null);
                                }}
                                disabled={approving}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Không
                            </button>
                            <button
                                onClick={handleApprovePost}
                                disabled={approving}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {approving ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang duyệt...
                                    </>
                                ) : (
                                    'Có'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Dialog */}
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
