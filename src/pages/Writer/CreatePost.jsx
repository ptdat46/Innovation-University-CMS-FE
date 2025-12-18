import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getAuthToken } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';

export default function CreatePost() {
    const navigate = useNavigate();
    const { user } = useAuth('writer');
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFeatured, setUploadingFeatured] = useState(false);
    const [featuredImagePreview, setFeaturedImagePreview] = useState('');
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [pdfName, setPdfName] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        category: 'news',
        featured_image: '',
        pdf_file: '',
    });

    useEffect(() => {
        if (!editorRef.current) return;

        const editorInstance = new EditorJS({
            holder: editorRef.current,
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: 'Nhập tiêu đề',
                        levels: [2, 3, 4],
                        defaultLevel: 2
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                },
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: 'http://localhost:8000/api/writer/upload/editor-image',
                        },
                        additionalRequestHeaders: {
                            Authorization: `Bearer ${getAuthToken()}`
                        },
                        field: 'image',
                        types: 'image/*',
                    }
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Nhập trích dẫn',
                        captionPlaceholder: 'Tác giả'
                    }
                },
                code: {
                    class: Code,
                    config: {
                        placeholder: 'Nhập code'
                    }
                },
                delimiter: Delimiter,
                table: {
                    class: Table,
                    inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3
                    }
                },
                warning: {
                    class: Warning,
                    inlineToolbar: true,
                    config: {
                        titlePlaceholder: 'Tiêu đề',
                        messagePlaceholder: 'Nội dung'
                    }
                },
            },
            placeholder: 'Bắt đầu viết nội dung bài viết của bạn...',
            autofocus: true,
        });

        setEditor(editorInstance);

        return () => {
            if (editorInstance && editorInstance.destroy) {
                editorInstance.destroy();
            }
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleFeaturedImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file ảnh');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Kích thước ảnh không được vượt quá 2MB');
            return;
        }

        setUploadingFeatured(true);
        setError('');

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const response = await api.post('/writer/upload/featured-image', formDataUpload);

            if (response.success) {
                setFormData(prev => ({
                    ...prev,
                    featured_image: response.data.url
                }));
                setFeaturedImagePreview(response.data.url);
            } else {
                setError(response.error || 'Lỗi khi upload ảnh');
            }
        } catch (err) {
            setError(err.message || 'Lỗi khi upload ảnh');
        } finally {
            setUploadingFeatured(false);
        }
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Vui lòng chọn file PDF');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Kích thước file không được vượt quá 10MB');
            return;
        }

        setUploadingPdf(true);
        setError('');

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await api.post('/writer/uploadPdf', formDataUpload);

            if (response.success) {
                setFormData(prev => ({
                    ...prev,
                    pdf_file: response.data.url
                }));
                setPdfName(response.data.original_name || file.name);
            } else {
                setError(response.error || 'Lỗi khi upload file PDF');
            }
        } catch (err) {
            setError(err.message || 'Lỗi khi upload file PDF');
        } finally {
            setUploadingPdf(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!editor) {
                setError('Editor chưa sẵn sàng');
                setLoading(false);
                return;
            }

            const outputData = await editor.save();

            if (!outputData.blocks || outputData.blocks.length === 0) {
                setError('Vui lòng nhập nội dung bài viết');
                setLoading(false);
                return;
            }

            const postData = {
                ...formData,
                content: outputData,
                writer_id: user.id,
                status: 'pending',
            };

            const response = await api.post('/writer/posts', postData);

            if (response.success) {
                navigate('/writer/dashboard');
            } else {
                setError(response.error || 'Có lỗi xảy ra khi tạo bài viết');
            }
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi tạo bài viết');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-green-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Tạo bài viết mới</h1>
                        <p className="text-green-200 text-sm">Writer: {user?.name}</p>
                    </div>
                    <button
                        onClick={() => navigate('/writer/dashboard')}
                        className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded-lg transition"
                    >
                        ← Quay lại Dashboard
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bài viết</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiêu đề <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Nhập tiêu đề bài viết"
                                />
                            </div>

                            <div>
                                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tóm tắt <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Nhập tóm tắt ngắn gọn về bài viết"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                        Danh mục <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="news">Tin tức</option>
                                        <option value="events">Sự kiện</option>
                                        <option value="clubs">Câu lạc bộ</option>
                                        <option value="student-life">Đời sống sinh viên</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-2">
                                        Ảnh đại diện
                                    </label>
                                    <input
                                        type="file"
                                        id="featured_image"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleFeaturedImageUpload}
                                        disabled={uploadingFeatured}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                                    />
                                    {uploadingFeatured && (
                                        <p className="mt-2 text-sm text-gray-600">Đang upload...</p>
                                    )}
                                    {featuredImagePreview && (
                                        <div className="mt-2">
                                            <img src={featuredImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="pdf_file" className="block text-sm font-medium text-gray-700 mb-2">
                                        File PDF đính kèm
                                    </label>
                                    <input
                                        type="file"
                                        id="pdf_file"
                                        accept="application/pdf"
                                        onChange={handlePdfUpload}
                                        disabled={uploadingPdf}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                                    />
                                    {uploadingPdf && (
                                        <p className="mt-2 text-sm text-gray-600">Đang upload PDF...</p>
                                    )}
                                    {pdfName && (
                                        <p className="mt-2 text-sm text-green-600">Đã chọn: {pdfName}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Nội dung bài viết <span className="text-red-500">*</span>
                        </h2>
                        <div 
                            ref={editorRef}
                            className="border border-gray-300 rounded-lg min-h-[400px] prose max-w-none"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/writer/dashboard')}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Đang tạo...
                                </>
                            ) : (
                                'Tạo bài viết'
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
