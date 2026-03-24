import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function LoginSuccess() {
    const { reissue } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const token = await reissue();
                console.log(token);
                if(token) {
                    navigate('/');
                } else {
                    navigate('/login');
                }
            }catch {
                navigate('/login');
            }
        })();
    }, [reissue, navigate]);

    return <div>Login in progress...</div>;
};