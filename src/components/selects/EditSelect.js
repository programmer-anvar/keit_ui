"use client";

import { Select } from 'antd';
import { useState } from 'react';
import FetchServices from '@/services/fetchSelectServices';
import { enumService } from '@/services/enumController';

const { Option } = Select;

const SelectionOptions = ({ 
    selectId,
    selectedFetch,
    setSelectedFetch,
    form,
    ...props 
}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOptions = async () => {
        try {
            setLoading(true);
            if (selectedFetch[selectId]) {
                setOptions(selectedFetch[selectId]);
                return;
            }

            const response = await enumService.getById(selectId);
            if (response && response?.lists) {
                const values = response.lists.reduce((acc, list) => {
                    return [...acc, ...list.values];
                }, []);
                
                setOptions(values);
                setSelectedFetch(prev => ({
                    ...prev,
                    [selectId]: values
                }));
            }
        } catch (error) {
            console.error('Error fetching selection options:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select
            {...props}
            loading={loading}
            allowClear
            onDropdownVisibleChange={(open) => {
                if (open && options.length === 0) {
                    fetchOptions();
                }
            }}
        >
            {options.map(option => (
                <Option key={option.id} value={option.name}>
                    {option.value}
                </Option>
            ))}
        </Select>
    );
};

export default SelectionOptions;
