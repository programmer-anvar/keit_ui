import { COLUMN_TYPES } from '@/constants/common';

export const processFormValues = (values, headers) => {
    console.log(values, headers)
    
    return headers.map(header => ({
        defineId: header.index,
        value: formatValueByType(values[header.index], header.columnType),
        name: header.name,
    }));
};

export const formatValueByType = (value, type) => {
    if (!value && value !== 0) return null;
    
    switch (type) {
        case COLUMN_TYPES.INTEGER:
        case COLUMN_TYPES.LONG:
        case COLUMN_TYPES.DOUBLE:
            return Number(value);
        case COLUMN_TYPES.BOOLEAN:
            return Boolean(value);
        case COLUMN_TYPES.FETCH_SELECT:
            return value?.value || null;
        case COLUMN_TYPES.DATE:
            return value ? value.format('YYYY-MM-DD') : null;
        default:
            return value;
    }
};

export const validateFormValues = (values, headers) => {
    const errors = {};
    
    headers.forEach(header => {
        const value = values[header.id];
        if (header.required && (value === undefined || value === null || value === '')) {
            errors[header.id] = `${header.name} is required`;
        }
    });
    
    return errors;
};

export const getInitialValues = (headers) => {
    const initialValues = {};
    
    headers.forEach(header => {
        switch (header.columnType) {
            case COLUMN_TYPES.INTEGER:
            case COLUMN_TYPES.LONG:
            case COLUMN_TYPES.DOUBLE:
                initialValues[header.id] = 0;
                break;
            case COLUMN_TYPES.BOOLEAN:
                initialValues[header.id] = false;
                break;
            default:
                initialValues[header.id] = null;
        }
    });
    
    return initialValues;
};
