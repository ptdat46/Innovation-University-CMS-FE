import Login from '../components/Login';

export default function UserLogin() {
    return (
        <Login 
            role="user"
            title="Đăng nhập"
            apiEndpoint="/login"
        />
    );
}