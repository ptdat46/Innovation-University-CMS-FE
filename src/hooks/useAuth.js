import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getAuthToken } from '../utils/api';

export const useAuth = (requiredRole = null) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        const user = getCurrentUser();

        if (!token || !user) {
            const loginPath = getLoginPath(requiredRole);
            navigate(loginPath, { replace: true });
            return;
        }

        if (requiredRole && user.role !== requiredRole) {
            const loginPath = getLoginPath(requiredRole);
            navigate(loginPath, { replace: true });
            return;
        }
    }, [navigate, requiredRole]);

    const user = getCurrentUser();
    const token = getAuthToken();

    return { user, token, isAuthenticated: !!token && !!user };
};

const getLoginPath = (role) => {
    switch(role) {
        case 'admin':
            return '/admin/login';
        case 'writer':
            return '/writer/login';
        default:
            return '/login';
    }
};
