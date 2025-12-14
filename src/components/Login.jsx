import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken, getAuthToken } from '../utils/api';
import banner from '../assets/big-banner.png';
import logo from '../assets/logo.png';

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
                switch(role) {
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

    const getRoleColor = () => {
        switch(role) {
            case 'admin':
                return 'bg-red-600 hover:bg-red-700';
            case 'writer':
                return 'bg-green-600 hover:bg-green-700';
            default:
                return 'bg-blue-600 hover:bg-blue-700';
        }
    };

    const getRoleBorderColor = () => {
        switch(role) {
            case 'admin':
                return 'border-red-500';
            case 'writer':
                return 'border-green-500';
            default:
                return 'border-blue-500';
        }
    };

    return (
        <div className="h-screen overflow-hidden relative flex items-center justify-center">
            <div className="fixed inset-0 z-[-1]">
                <img 
                    src={banner} 
                    alt="Background" 
                    className="w-full h-full object-cover filter blur-sm brightness-50" 
                />
            </div>

            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8 mx-4">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="Logo" className="h-20" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Innovation University
                    </h1>
                    <div className={`h-1 w-24 mx-auto mb-4 ${getRoleBorderColor().replace('border-', 'bg-')}`}></div>
                    <h2 className="text-xl font-semibold text-gray-700">
                        {title}
                    </h2>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="email@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${getRoleColor()} text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center`}
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

                {/* Back to Home */}
                {role === 'user' && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            ← Quay về trang chủ
                        </button>
                    </div>
                )}

                {/* Other Login Links */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600 mb-3">
                        Đăng nhập với vai trò khác:
                    </p>
                    <div className="flex flex-col space-y-2">
                        {role !== 'admin' && (
                            <button
                                onClick={() => navigate('/admin/login')}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Đăng nhập Admin
                            </button>
                        )}
                        {role !== 'writer' && (
                            <button
                                onClick={() => navigate('/writer/login')}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                                Đăng nhập Writer
                            </button>
                        )}
                        {role !== 'user' && (
                            <button
                                onClick={() => navigate('/login')}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Đăng nhập User
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}