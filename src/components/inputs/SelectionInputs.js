"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Row, Col, Select } from 'antd';
import { enumService } from '@/services/enumController';

const SelectionInputs = ({ selectedType, selectionValues, setSelectionValues, title }) => {
    const [data, setData] = useState([]);

    const fetchSelectionValues = async () => {
        const response = await enumService.get();
        setData(response);
    }

    useEffect(() => {
        fetchSelectionValues()
    }, [])
    console.log(selectionValues);
    
    return (
        <Card title={title || "Selection Inputs"}>
            <Select
                labelInValue
                style={{ width: '100%' }}
                value={selectionValues}
                onChange={(value) => setSelectionValues(value)}
                placeholder={`select value`}
            >
                {data.map((value, index) => (
                    <Select.Option key={index} value={value.id}>{value.typeName}</Select.Option>
                ))}
            </Select>
        </Card>
    );
};

export default SelectionInputs;
