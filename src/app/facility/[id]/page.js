"use client";

import companyService from "@/services/companyController";
import { Button, Card, Form, Input, Select, DatePicker, Row, Col, Space } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { COLUMN_TYPES, CompanyTableColumns } from "@/constants/common";
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

const { Option } = Select;

const FacilityEditPage = () => {
    const { id } = useParams();

    const fetchData = async () => {
        const response = await companyService.getValuesById(id);
        // const data = await response.json();
        console.log(response);
    }

    const renderInputComponent = (column) => {
        const { type } = column;
        let inputComponent;

        switch (type) {
            case COLUMN_TYPES.STRING:
                inputComponent = <Input placeholder={`Enter ${column.title}`} />;
                break;
            case COLUMN_TYPES.INTEGER:
            case COLUMN_TYPES.LONG:
            case COLUMN_TYPES.DOUBLE:
                inputComponent = <Input type="number" placeholder={`Enter ${column.title}`} />;
                break;
            case COLUMN_TYPES.DATE:
                inputComponent = <DatePicker style={{ width: '100%' }} placeholder={`Select ${column.title}`} />;
                break;
            case COLUMN_TYPES.SELECTION:
                inputComponent = (
                    <Select placeholder={`Select ${column.title}`}>
                        {/* Options should be dynamically generated based on column data */}
                        <Option value="option1">Option 1</Option>
                        <Option value="option2">Option 2</Option>
                    </Select>
                );
                break;
            default:
                inputComponent = <Input placeholder={`Enter ${column.title}`} />;
        }

        return inputComponent;
    };

    const handleSubmit = async () => {
        console.log('Form submitted');
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card 
            title="Company Page"
            extra={
                <Space size="small">
                    <Button 
                        size="small"
                        icon={<RollbackOutlined />} 
                        onClick={() => router.push('/company')}
                    >
                        취소
                    </Button>
                    <Button 
                        size="small"
                        type="primary" 
                        icon={<SaveOutlined />} 
                        onClick={handleSubmit}
                    >
                        저장
                    </Button>
                </Space>

            }
        >
            <Form
                name="company_id_form"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
                // style={{ maxWidth: 1000 }}
                initialValues={{ remember: true }}
                autoComplete="off"
            >
                <Row gutter={16}>
                    {CompanyTableColumns.map((column, index) => (
                        <Col span={12} key={column.dataIndex}>
                            <Form.Item
                                name={column.dataIndex}
                                label={column.title}
                                rules={[{ required: true, message: `Please enter ${column.title}` }]}
                            >
                                {renderInputComponent(column)}
                            </Form.Item>
                        </Col>
                    ))}
                </Row>
            </Form>
        </Card>
    )
};

export default FacilityEditPage;