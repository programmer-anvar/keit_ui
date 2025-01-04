"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button, Result } from "antd";

const ERROR_CONFIG = {
    '403': {
        status: '403',
        title: '접근 권한이 없습니다',
        subTitle: '이 페이지에 접근할 권한이 없습니다'
    },
    '404': {
        status: '404',
        title: '페이지를 찾을 수 없습니다',
        subTitle: '요청하신 페이지가 존재하지 않습니다'
    },
    '500': {
        status: '500',
        title: '서버 오류',
        subTitle: '서버에서 문제가 발생했습니다'
    },
    'offline': {
        status: 'warning',
        title: '네트워크 연결 없음',
        subTitle: '인터넷 연결을 확인해주세요'
    },
    'network_error': {
        status: 'error',
        title: '네트워크 오류',
        subTitle: '서버와 통신하는 중 문제가 발생했습니다'
    },
    'timeout': {
        status: 'warning',
        title: '요청 시간 초과',
        subTitle: '서버 응답이 너무 오래 걸립니다'
    }
};

const ErrorPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get error details from URL
    const status = searchParams.get('status') || '500';
    const from = searchParams.get('from');
    const timestamp = searchParams.get('timestamp');

    // Get error configuration
    const errorConfig = ERROR_CONFIG[status] || ERROR_CONFIG['500'];

    // Build action buttons
    const actions = [
        <Button 
            key="home" 
            type="primary" 
            onClick={() => router.push('/')}
        >
            홈으로 가기
        </Button>
    ];

    // Add back button if we have a 'from' path
    if (from && from !== '/') {
        actions.unshift(
            <Button 
                key="back" 
                onClick={() => router.back()}
            >
                이전 페이지
            </Button>
        );
    }

    // Add refresh button
    actions.push(
        <Button 
            key="refresh" 
            onClick={() => window.location.reload()}
        >
            새로고침
        </Button>
    );

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            width: '100%',
            padding: '20px',
            background: '#E9ECF4'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                maxWidth: '100%',
                width: '600px',
                animation: 'fadeIn 0.3s ease'
            }}>
                <Result
                    status={errorConfig.status}
                    title={errorConfig.title}
                    subTitle={errorConfig.subTitle}
                    extra={actions}
                >
                    {timestamp && (
                        <div style={{ 
                            textAlign: 'center', 
                            marginTop: '24px', 
                            color: '#666',
                            fontSize: '14px'
                        }}>
                            발생 시간: {new Date(timestamp).toLocaleString()}
                        </div>
                    )}
                </Result>
            </div>
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ErrorPage;