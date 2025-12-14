import Login from '../../components/Login';

export default function AdminLogin() {
    return (
        <Login
            role="admin"
            title="Đăng nhập dành cho Admin"
            apiEndpoint="/admin/login"
        />
    );
}