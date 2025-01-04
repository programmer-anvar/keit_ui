"use client";

import api from '@/services/api';
import { setAuthState } from '@/utils/authHelper';
import Cookies from 'js-cookie';

export const login = async (username, password) => {
    try {
        const response = await api.post('/v1/auth/log-in', { username, password });
        
        if (response?.data?.success) {
            const { accessToken, refreshToken, orgId, userInfo } = response.data.data;
            
            // Set token in cookie for middleware
            Cookies.set('token', accessToken, { path: '/' });
            
            // Set all auth data in storage
            setAuthState({
                token: accessToken,
                refreshToken,
                orgId,
                userInfo
            });
            
            return {
                success: true,
                data: response.data.data
            };
        }
        
        return {
            success: false,
            message: response?.data?.message || '로그인에 실패했습니다'
        };
    } catch (error) {
        console.error('Login error:', error);
        
        // Clear auth state on 401
        if (error.response?.status === 401) {
            Cookies.remove('token', { path: '/' });
        }
        
        return {
            success: false,
            message: error.response?.data?.message || '로그인 중 오류가 발생했습니다'
        };
    }
};

export const logout = async () => {
    Cookies.remove('token', { path: '/' });
    localStorage.clear()
};

export const refreshAccessToken = async () => {
    try {
        const response = await api.post('/v1/auth/refresh');
        if (response?.data?.success) {
            const { accessToken, refreshToken } = response.data.data;
            
            // Update token in cookie
            Cookies.set('token', accessToken, { path: '/' });
            
            // Update storage
            setAuthState({
                token: accessToken,
                refreshToken
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error('Token refresh error:', error);
        Cookies.remove('token', { path: '/' });
        return false;
    }
};
