"use client";

const AUTH_KEYS = {
    TOKEN: 'token',
    REFRESH_TOKEN: 'refreshToken',
    ORG_ID: 'orgId',
    USER_INFO: 'userInfo'
};

class AuthStorage {
    static isClient = typeof window !== 'undefined';

    static setItem(key, value) {
        if (!this.isClient) return false;
        try {
            sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
            return false;
        }
    }

    static getItem(key, parse = false) {
        if (!this.isClient) return null;
        try {
            const value = sessionStorage.getItem(key);
            return parse ? (value ? JSON.parse(value) : null) : (value || '');
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return null;
        }
    }

    static removeItem(key) {
        if (!this.isClient) return false;
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            return false;
        }
    }

    static clear() {
        if (!this.isClient) return false;
        try {
            sessionStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
}

// Auth state management
export const setAuthState = ({ token, refreshToken, orgId, userInfo }) => {
    if (token) AuthStorage.setItem(AUTH_KEYS.TOKEN, token);
    if (refreshToken) AuthStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
    if (orgId) AuthStorage.setItem(AUTH_KEYS.ORG_ID, orgId);
    if (userInfo) AuthStorage.setItem(AUTH_KEYS.USER_INFO, userInfo);
    return true;
};

export const getAuthState = () => ({
    token: AuthStorage.getItem(AUTH_KEYS.TOKEN),
    refreshToken: AuthStorage.getItem(AUTH_KEYS.REFRESH_TOKEN),
    orgId: AuthStorage.getItem(AUTH_KEYS.ORG_ID),
    userInfo: AuthStorage.getItem(AUTH_KEYS.USER_INFO, true)
});

export const clearAuthState = () => {
    return AuthStorage.clear();
};

// Token management
export const setToken = (token, refreshToken, orgId) => {
    return setAuthState({ token, refreshToken, orgId });
};

export const getToken = () => AuthStorage.getItem(AUTH_KEYS.TOKEN);
export const getRefreshToken = () => AuthStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
export const hasToken = () => !!getToken();

// Organization management
export const setOrgId = (orgId) => AuthStorage.setItem(AUTH_KEYS.ORG_ID, orgId);
export const getOrgId = () => AuthStorage.getItem(AUTH_KEYS.ORG_ID);

// User info management
export const setUserInfo = (userInfo) => AuthStorage.setItem(AUTH_KEYS.USER_INFO, userInfo);
export const getUserInfo = () => AuthStorage.getItem(AUTH_KEYS.USER_INFO, true);

// Alias for clearAuthState
export const clearAuth = clearAuthState;