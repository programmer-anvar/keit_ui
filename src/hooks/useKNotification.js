import { notification } from 'antd';

const useKNotification = () => {
    const [api, contextHolder] = notification.useNotification();

    const notify = (type, message, description) => {
        api[type]({
            message,
            description,
            placement: 'topRight',
            duration: 3,
        });
    };

    return {
        SUCCESS: (message, description) => notify('success', message, description),
        ERROR: (message, description) => notify('error', message, description),
        WARNING: (message, description) => notify('warning', message, description),
        INFO: (message, description) => notify('info', message, description),
        contextHolder,
    };
};

export default useKNotification;