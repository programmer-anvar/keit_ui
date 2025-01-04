// Import Axios instance
import api from '@/services/api';

// Unique request tracking to prevent duplicate requests
const requestCache = new Map();

// Enhanced error handling with more detailed information
export const handleError = (error, context = {}) => {
    const errorResponse = {
        success: false,
        message: 'An unexpected error occurred',
        status: 500,
        timestamp: new Date().toISOString(),
        ...context
    };

    if (error.response) {
        // Server responded with an error status
        errorResponse.status = error.response.status;
        errorResponse.message = error.response.data?.message || 
                                 error.response.statusText || 
                                 'Server error';
        errorResponse.data = error.response.data;
    } else if (error.request) {
        // Request was made but no response received
        errorResponse.message = 'No response received from server';
        errorResponse.status = 0;
    } else {
        // Error in setting up the request
        errorResponse.message = error.message;
    }

    // console.error('Request Error:', errorResponse);
    return errorResponse;
};

// Centralized request method with advanced caching and deduplication
const makeRequest = async (method, url, payload = null, options = {}) => {
    const cacheKey = `${method}:${url}:${JSON.stringify(payload)}`;
    
    // Check if request is already in progress
    if (requestCache.has(cacheKey)) {
        return await requestCache.get(cacheKey);
    }

    const requestPromise = (async () => {
        try {
            let response;
            switch (method) {
                case 'post':
                    response = await api.post(url, payload, options);
                    break;
                case 'get':
                    response = await api.get(url, { ...options, params: payload });
                    break;
                case 'put':
                    response = await api.put(url, payload, options);
                    break;
                case 'delete':
                    response = await api.delete(url, { ...options, params: payload });
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }

            // Normalize response
            const responseData = response.data;
            if (responseData?.success === false) {
                throw new Error(responseData.message || 'Request failed');
            }

            return {
                success: true,
                data: responseData?.data || responseData,
                message: responseData?.message || 'Success'
            };
        } catch (error) {
            return handleError(error, { url, method, payload });
        } finally {
            // Remove from cache after request completes
            requestCache.delete(cacheKey);
        }
    })();

    // Store ongoing request in cache
    requestCache.set(cacheKey, requestPromise);
    
    return await requestPromise;
};

// Simplified request methods
export const createItem = (url, payload, options = {}) => 
    makeRequest('post', url, payload, options);

export const fetchData = (url, params = {}, options = {}) => 
    makeRequest('get', url, params, options);

export const editItem = (url, payload, options = {}) => 
    makeRequest('put', url, payload, options);

export const removeItem = (url, params = {}, options = {}) => 
    makeRequest('delete', url, params, options);

export const searchItems = (url, query, options = {}) => 
    makeRequest('post', url, query, options);
