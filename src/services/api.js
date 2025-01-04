"use client";

import axios from 'axios';
import Cookies from 'js-cookie';

// Constants
const TOKEN_CONFIG = {
    token: {
        key: 'token',
        prefix: 'Bearer'
    },
    refresh: {
        key: 'refreshToken',
        endpoint: '/auth/refresh'
    }
};

const TIMEOUT_MS = 30000;

// Create axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: TIMEOUT_MS,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true
    }
});

// Token management
class TokenManager {
    static isRefreshing = false;
    static refreshQueue = [];

    static getToken = () => Cookies.get(TOKEN_CONFIG.token.key);
    static getRefreshToken = () => Cookies.get(TOKEN_CONFIG.refresh.key);
    static hasToken = () => !!this.getToken();

    static setTokens(tokens) {
        const { token, refreshToken } = tokens;
        if (token) Cookies.set(TOKEN_CONFIG.token.key, token);
        if (refreshToken) Cookies.set(TOKEN_CONFIG.refresh.key, refreshToken);
    }

    static clearTokens() {
        Cookies.remove(TOKEN_CONFIG.token.key);
        Cookies.remove(TOKEN_CONFIG.refresh.key);
    }

    static processQueue(error, token = null) {
        this.refreshQueue.forEach(({ resolve, reject }) => {
            if (error) reject(error);
            else resolve(token);
        });
        this.refreshQueue = [];
    }
}

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Skip auth header for auth endpoints
        if (config.url?.includes('/auth/')) return config;

        const token = TokenManager.getToken();
        if (token) {
            config.headers.Authorization = `${TOKEN_CONFIG.token.prefix} ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;

        // Handle token refresh
        if (status === 401 && !originalRequest._retry) {
            if (TokenManager.isRefreshing) {
                try {
                    const token = await new Promise((resolve, reject) => {
                        TokenManager.refreshQueue.push({ resolve, reject });
                    });
                    originalRequest.headers.Authorization = `${TOKEN_CONFIG.token.prefix} ${token}`;
                    return api(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }

            originalRequest._retry = true;
            TokenManager.isRefreshing = true;

            try {
                const refreshToken = TokenManager.getRefreshToken();
                if (!refreshToken) throw new Error('No refresh token available');

                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}${TOKEN_CONFIG.refresh.endpoint}`,
                    { refreshToken }
                );

                if (response.data?.token) {
                    TokenManager.setTokens(response.data);
                    api.defaults.headers.common.Authorization = `${TOKEN_CONFIG.token.prefix} ${response.data.token}`;
                    originalRequest.headers.Authorization = `${TOKEN_CONFIG.token.prefix} ${response.data.token}`;
                    
                    TokenManager.processQueue(null, response.data.token);
                    return api(originalRequest);
                } else {
                    throw new Error('Invalid refresh token response');
                }
            } catch (refreshError) {
                TokenManager.processQueue(refreshError);
                handleAuthError();
                return Promise.reject(refreshError);
            } finally {
                TokenManager.isRefreshing = false;
            }
        }

        // Handle other errors
        handleApiError(error);
        return Promise.reject(enhanceError(error));
    }
);

// Error handlers
const handleAuthError = () => {
    TokenManager.clearTokens();
    window.location.replace('/login');
};

const handleApiError = (error) => {
    const status = error?.response?.status;

    if (status === 403) {
        if (!TokenManager.hasToken()) {
            window.location.replace('/login');
        }
    }
};

const enhanceError = (error) => {
    const status = error?.response?.status;
    return {
        status: status || 500,
        message: error?.response?.data?.message || error.message,
        timestamp: new Date().toISOString(),
        url: error.config?.url,
        method: error.config?.method,
    };
};

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
    api.interceptors.request.use(request => {
        console.debug('API Request:', {
            url: request.url,
            method: request.method,
            headers: request.headers,
            data: request.data
        });
        return request;
    });

    api.interceptors.response.use(
        response => {
            console.debug('API Response:', {
                url: response.config.url,
                status: response.status,
                data: response.data
            });
            return response;
        },
        error => {
            console.log('API Error:', enhanceError(error));
            return Promise.reject(error);
        }
    );
}

export default api;
