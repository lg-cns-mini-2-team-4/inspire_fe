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
                    console.log("해야지?");
                    navigate('/');
                } else {
                    console.log("안해야지?");
                    navigate('/login');
                }
            }catch {
                console.log("에러지?");
                navigate('/login');
            }
        })();
    }, [reissue, navigate]);

    return <div>Login in progress...</div>;
};