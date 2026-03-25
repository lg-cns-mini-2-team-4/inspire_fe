import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function OAuthRegister() {
    const { oauthSignup } = authApi();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleFinalSignup = async () => {
            try {
                // 1. 회원가입 API 호출 (쿠키가 자동으로 전송됨)
                const res = await oauthSignup(); 
                
                // 2. 성공 시 받은 accessToken을 AuthContext에 저장 (로그인 상태로 전환)
                if (res && res.accessToken) {
                    login(res.accessToken);
                    
                    alert("회원가입이 완료되었습니다.");
                    navigate("/");
                } 
                
                alert("회원가입이 완료되었습니다.");
                navigate("/");
            } catch (error) {
                console.error("가입 실패:", error);
                alert("가입 처리 중 오류가 발생했습니다. 다시 로그인해 주세요.");
                navigate("/login");
            }
        };

        handleFinalSignup();
    }, []);

    return <div>Login in progress...</div>;
};
// /oauth/signup