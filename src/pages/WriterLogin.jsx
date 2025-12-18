import Login from '../components/Login';

export default function WriterLogin() {
    return (
        <Login
            role="writer"
            title="Đăng nhập cho Người viết bài"
            apiEndpoint="/writer/login"
        />
    );
}