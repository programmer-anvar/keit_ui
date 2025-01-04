import { useState } from 'react';
import { Form } from 'antd';
import { useKNotification } from './useKNotification';

export const useFormHandler = ({ onSubmit, onSuccess, onError }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { notify } = useKNotification();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await onSubmit(values);
            notify('success', 'Success', onSuccess || 'Operation completed successfully');
            form.resetFields();
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Operation failed';
            notify('error', 'Error', onError || errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        form.resetFields();
    };

    return {
        form,
        loading,
        handleSubmit,
        resetForm,
    };
};

export default useFormHandler;
