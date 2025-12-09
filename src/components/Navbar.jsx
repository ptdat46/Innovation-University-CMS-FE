import { Link, useLocation } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Trang chủ' },
    { path: '/news', label: 'Tin tức' },
    { path: '/events', label: 'Sự kiện' },
    { path: '/clubs', label: 'CLB' },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between" style={{ height: '70px' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center" style={{ gap: '0px', textDecoration: 'none' }}>
            <img src={logo} alt="Logo" className="h-12" />
          <div className="flex flex-col" style={{ lineHeight: '1.3' }}>
            <span className="text-blue-900 text-lg font-bold">Innovation</span>
            <span className="text-blue-900 text-lg font-bold">University</span>
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
                      ? 'text-blue-800 font-semibold'
                      : 'text-gray-600 hover:text-blue-800'
                  }`}
                  style={{ 
                    textDecoration: 'none',
                    fontSize: '15px'
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span 
                      className="absolute bg-blue-800"
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

        {/* Login Button */}
        <Link
          to="/login"
          className="flex items-center bg-blue-800 hover:bg-blue-900 text-white rounded-md text-sm font-semibold transition-colors"
          style={{
            gap: '8px',
            padding: '10px 28px',
            textDecoration: 'none'
          }}
        >
          <FiUser style={{ fontSize: '18px' }} />
          <span>Đăng nhập</span>
        </Link>
      </div>
    </nav>
  );
};

