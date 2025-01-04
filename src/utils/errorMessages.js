// Error message constants
export const ERROR_MESSAGES = {
    400: '잘못된 요청입니다.',
    401: '로그인이 필요합니다.',
    403: '접근 권한이 없습니다.',
    404: '요청하신 페이지를 찾을 수 없습니다.',
    500: '서버 오류가 발생했습니다.',
    502: '서버와 통신 중 오류가 발생했습니다.',
    503: '서비스를 일시적으로 사용할 수 없습니다.',
    504: '서버 응답 시간이 초과되었습니다.',
    default: '알 수 없는 오류가 발생했습니다.',
    network: '네트워크 연결을 확인해주세요.',
    timeout: '요청 시간이 초과되었습니다.',
};

// Get appropriate error message
export const getErrorMessage = (error) => {
    if (!navigator.onLine) {
        return ERROR_MESSAGES.network;
    }

    if (error?.code === 'ECONNABORTED') {
        return ERROR_MESSAGES.timeout;
    }

    const status = error?.response?.status || error?.status;
    const serverMessage = error?.response?.data?.message || error?.message;

    // If we have a specific message from the server, use it
    if (serverMessage && typeof serverMessage === 'string') {
        return serverMessage;
    }

    // Otherwise, use our predefined messages
    return ERROR_MESSAGES[status] || ERROR_MESSAGES.default;
};
