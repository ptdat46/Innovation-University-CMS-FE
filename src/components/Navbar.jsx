import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import logo from '../assets/logo.svg';
import { getAuthToken, removeAuthToken } from '../utils/api';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = getAuthToken();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Trang chủ' },
    { path: '/introduction', label: 'Giới thiệu' },
    { path: '/news', label: 'Tin tức' },
    { path: '/events', label: 'Sự kiện' },
    { path: '/clubs', label: 'CLB' },
    { path: '/student-life', label: 'Đời sống sinh viên' },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between" style={{ height: '72px' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center" style={{ gap: '0px', textDecoration: 'none' }}>
            <img src={logo} alt="Logo" className="h-12 mr-2" />
          <div className="flex flex-col" style={{ lineHeight: '1.3' }}>
            <span className="text-[#1f2933] text-lg font-bold">Innovation</span>
            <span className="text-[#1f2933] text-lg font-bold">University</span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <ul className="hidden md:flex items-center list-none m-0 p-0" style={{ gap: '35px' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`relative font-medium py-2 transition-colors ${
                    isActive
                      ? 'text-[#c9151b] font-semibold'
                      : 'text-gray-600 hover:text-[#c9151b]'
                  }`}
                  style={{ 
                    textDecoration: 'none',
                    fontSize: '15px'
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span 
                      className="absolute bg-[#c9151b]"
                      style={{
                        bottom: '-22px',
                        left: 0,
                        right: 0,
                        height: '3px'
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Login/Logout Button */}
        {!token ? (
          <Link
            to="/login"
            className="flex items-center bg-[#c9151b] hover:bg-[#a51218] text-white rounded-md text-sm font-semibold transition-colors shadow-sm"
            style={{
              gap: '8px',
              padding: '10px 28px',
              textDecoration: 'none'
            }}
          >
            <FiUser style={{ fontSize: '18px' }} />
            <span>Đăng nhập</span>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-gray-700 text-sm">
              Xin chào, <strong>{user?.name || 'User'}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center bg-[#c9151b] hover:bg-[#a51218] text-white rounded-md text-sm font-semibold transition-colors shadow-sm"
              style={{
                gap: '8px',
                padding: '10px 16px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <FiLogOut style={{ fontSize: '18px' }} />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

