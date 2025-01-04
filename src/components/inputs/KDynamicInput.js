"use client";

import { Input, Select, DatePicker, TimePicker } from 'antd';
import { useMemo } from 'react';
import { COLUMN_TYPES } from '@/constants/common';
import FetchSelect from '../selects/FetchSelect';
import SelectionOptions from '../selects/EditSelect';

const { Option } = Select;

const KDynamicInput = ({ 
    field, 
    form,
    selectedFetch,
    setSelectedFetch,
    style = {},
    ...props 
}) => {
    const commonProps = useMemo(() => ({
        style: { width: '100%', ...style },
        placeholder: `Enter ${field.name}`,
        ...props
    }), [field.name, style, props]);

    switch (field.columnType) {
        case COLUMN_TYPES.STRING:
            return <Input {...commonProps} />;
            
        case COLUMN_TYPES.INTEGER:
        case COLUMN_TYPES.LONG:
        case COLUMN_TYPES.DOUBLE:
            return <Input type="number" {...commonProps} />;
            
        case COLUMN_TYPES.BOOLEAN:
            return (
                <Select {...commonProps}>
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                </Select>
            );
            
        case COLUMN_TYPES.SELECTION:
            return (
                <SelectionOptions 
                    selectId={field.selectionId}
                    selectedFetch={selectedFetch}
                    setSelectedFetch={setSelectedFetch}
                    form={form}
                    {...commonProps}
                />
            );
            
            
        case COLUMN_TYPES.FETCH_SELECT:            
            return (
                <FetchSelect
                    selectId={field.fetchMapping}
                    selectedFetch={selectedFetch}
                    setSelectedFetch={setSelectedFetch}
                    form={form}
                    {...commonProps}
                />
            );
            
        case COLUMN_TYPES.DATE:
            return <DatePicker {...commonProps} format="YYYY-MM-DD" />;
            
        case COLUMN_TYPES.TIME:
            return <TimePicker {...commonProps} format="HH:mm" />;
            
        case COLUMN_TYPES.TEXTAREA:
            return <Input.TextArea rows={4} {...commonProps} />;
            
        default:
            return <Input {...commonProps} />;
    }
};

export default KDynamicInput;
