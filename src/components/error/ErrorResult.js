import React from 'react';
import { Result, Button, Typography } from 'antd';
import styles from './ErrorResult.module.css';

const { Paragraph, Text } = Typography;

// Error configurations with Ant Design status mappings
const ERROR_CONFIG = {
    offline: {
        title: '네트워크 연결 없음',
        subtitle: '인터넷 연결을 확인해주세요.',
        status: 'warning'
    },
    network_error: {
        title: '네트워크 오류',
        subtitle: '서버와 통신하는 중 문제가 발생했습니다.',
        status: 'error'
    },
    timeout: {
        title: '요청 시간 초과',
        subtitle: '서버 응답이 너무 오래 걸립니다.',
        status: 'warning'
    },
    forbidden: {
        title: '접근 권한 없음',
        subtitle: '이 페이지에 접근할 권한이 없습니다.',
        status: '403'
    },
    not_found: {
        title: '페이지를 찾을 수 없음',
        subtitle: '요청하신 페이지가 존재하지 않습니다.',
        status: '404'
    },
    server_error: {
        title: '서버 오류',
        subtitle: '서버에서 문제가 발생했습니다.',
        status: '500'
    },
    unknown: {
        title: '알 수 없는 오류',
        subtitle: '예기치 않은 오류가 발생했습니다.',
        status: 'error'
    }
};

const ErrorResult = ({ status, type = 'unknown', timestamp, from }) => {
    const errorInfo = ERROR_CONFIG[type] || ERROR_CONFIG.unknown;
    
    const actions = [
        <Button 
            key="home" 
            type="primary" 
            onClick={() => window.location.href = '/'}
        >
            홈으로 가기
        </Button>,
        <Button 
            key="reload" 
            onClick={() => window.location.reload()}
        >
            새로고침
        </Button>
    ];

    // Add "Go Back" action if we have a 'from' path
    if (from && from !== '/') {
        actions.unshift(
            <Button 
                key="back" 
                onClick={() => window.history.back()}
            >
                이전 페이지
            </Button>
        );
    }

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <Result
                    status={errorInfo.status}
                    title={errorInfo.title}
                    subTitle={errorInfo.subtitle}
                    extra={actions}
                >
                    {timestamp && (
                        <div className={styles.extraInfo}>
                            <Paragraph type="secondary">
                                <Text type="secondary">
                                    발생 시간: {new Date(timestamp).toLocaleString()}
                                </Text>
                            </Paragraph>
                        </div>
                    )}
                </Result>
            </div>
        </div>
    );
};

export default ErrorResult;
