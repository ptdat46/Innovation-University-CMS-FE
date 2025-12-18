import Login from '../../components/Login';

export default function AdminLogin() {
    return (
        <Login
            role="admin"
            title="Đăng nhập cho Quản trị viên"
            apiEndpoint="/admin/login"
        />
    );
}