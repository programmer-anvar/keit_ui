"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, logout } from '@/services/authController';

const useAuthHandler = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const getRedirectPath = useCallback(() => {
        if (typeof window === 'undefined') return '/';
        const from = searchParams.get('from');
        return from || '/';
    }, [searchParams]);

    const handleLogin = useCallback(async (username, password) => {
        if (!username || !password) {
            setError('아이디와 비밀번호를 입력해주세요');
            return;
        }

        if (loading) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await login(username, password);
            console.log('Login response:', response); // Debug log
            
            if (response.success) {
                const redirectPath = getRedirectPath();
                console.log('Redirecting to:', redirectPath); // Debug log
                
                // Force a hard navigation
                window.location.href = redirectPath;
            } else {
                setError(response.message);
            }
        } catch (err) {
            console.error('Login handler error:', err);
            setError(err.message || '로그인 중 오류가 발생했습니다');
        } finally {
            setLoading(false);
        }
    }, [loading, getRedirectPath]);

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            await logout();
            // Force a hard navigation to login
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect to login on error
            window.location.href = '/login';
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        handleLogin, 
        handleLogout, 
        loading, 
        error,
        redirectPath: getRedirectPath()
    };
};

export default useAuthHandler;
