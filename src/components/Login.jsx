import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken, getAuthToken } from '../utils/api';
import banner from '../assets/IntroductionHeroBanner.png';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Login({ role = 'user', title, apiEndpoint }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user?.role === role) {
                // Redirect to appropriate dashboard based on role
                if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (role === 'writer') {
                    navigate('/writer/dashboard');
                } else {
                    navigate('/');
                }
            }
        }
    }, [role, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post(apiEndpoint, formData);

            if (response.success) {
                const { token, user } = response.data;
                setAuthToken(token);
                localStorage.setItem('user', JSON.stringify(user));
                switch (role) {
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'writer':
                        navigate('/writer/dashboard');
                        break;
                    default:
                        navigate('/');
                        break;
                }
            } else {
                setError(response.error || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi đăng nhập');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-[#f7f3ef]">
            <Navbar />

            {/* Hero Section */}
            <div
                className="relative text-white"
                style={{
                    backgroundImage: `url(${banner})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    height: '150px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >

                <h1 className="text-4xl font-bold mb-2">{title || 'Đăng nhập'}</h1>
            </div>

            {/* Login Form Section */}
            <section className="py-16 px-6">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9151b] focus:border-transparent transition"
                                placeholder="Nhập email của bạn"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9151b] focus:border-transparent transition"
                                placeholder="Nhập mật khẩu của bạn"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#c9151b] hover:bg-[#a01318] text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </form>

                    {/* Additional Links */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        {role === 'user' && (
                            <div className="text-center mb-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="text-[#c9151b] hover:text-[#a01318] text-sm font-medium"
                                >
                                    ← Quay về trang chủ
                                </button>
                            </div>
                        )}

                        <p className="text-center text-sm text-gray-600 mb-3">
                            Đăng nhập với vai trò khác:
                        </p>
                        <div className="flex flex-col space-y-2 text-center">
                            {role !== 'admin' && (
                                <button
                                    onClick={() => navigate('/admin/login')}
                                    className="text-[#c9151b] hover:text-[#a01318] text-sm font-medium"
                                >
                                    Đăng nhập Admin
                                </button>
                            )}
                            {role !== 'writer' && (
                                <button
                                    onClick={() => navigate('/writer/login')}
                                    className="text-[#c9151b] hover:text-[#a01318] text-sm font-medium"
                                >
                                    Đăng nhập Writer
                                </button>
                            )}
                            {role !== 'user' && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-[#c9151b] hover:text-[#a01318] text-sm font-medium"
                                >
                                    Đăng nhập User
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}