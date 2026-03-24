import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../api/authApi';

export default function OAuthRegister() {
    const api = authApi();
    
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {})();
    }, []);

    return <div>Login in progress...</div>;
};
// /oauth/signup