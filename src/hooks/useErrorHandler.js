"use client";

import { useCallback, useRef } from 'react';

// Error type mapping
const ERROR_TYPES = {
    NETWORK: {
        type: 'network_error',
        condition: (error) => !error.response && error.message === 'Network Error'
    },
    OFFLINE: {
        type: 'offline',
        condition: () => !navigator.onLine
    },
    TIMEOUT: {
        type: 'timeout',
        condition: (error) => error.code === 'ECONNABORTED'
    },
    FORBIDDEN: {
        type: '403',
        condition: (error) => error?.response?.status === 403
    },
    NOT_FOUND: {
        type: '404',
        condition: (error) => error?.response?.status === 404
    },
    SERVER_ERROR: {
        type: '500',
        condition: (error) => error?.response?.status >= 500
    }
};

const useErrorHandler = () => {
    const isRedirecting = useRef(false);

    const handleError = useCallback(async (error) => {
        // Prevent multiple redirects
        if (isRedirecting.current) return;
        isRedirecting.current = true;

        try {
            // Determine error type
            const errorType = Object.values(ERROR_TYPES).find(
                type => type.condition(error)
            )?.type || '500';

            // Build error URL
            const errorUrl = new URL('/error', window.location.origin);
            const searchParams = new URLSearchParams({
                status: errorType,
                timestamp: new Date().toISOString(),
                from: window.location.pathname
            });

            // Redirect to error page
            window.location.replace(`${errorUrl.pathname}?${searchParams.toString()}`);
        } catch (e) {
            console.error('Error in error handler:', e);
            // Fallback error handling
            window.location.replace('/error?status=500');
        } finally {
            // Reset redirect flag after delay
            setTimeout(() => {
                isRedirecting.current = false;
            }, 1000);
        }
    }, []);

    return handleError;
};

export default useErrorHandler;
