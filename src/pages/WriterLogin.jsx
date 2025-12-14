import Login from '../components/Login';

export default function WriterLogin() {
    return (
        <Login
            role="writer"
            title="Đăng nhập dành cho nhà văn"
            apiEndpoint="/writer/login"
        />
    );
}