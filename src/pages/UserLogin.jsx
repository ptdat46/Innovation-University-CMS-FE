import Login from '../components/Login';

export default function UserLogin() {
    return (
        <Login 
            role="user"
            title="Đăng nhập cho Người dùng"
            apiEndpoint="/login"
        />
    );
}