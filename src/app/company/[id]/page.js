"use client";

import { Button, Card, Form, Input, Select, DatePicker, Row, Col, Space, Table } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { COLUMN_TYPES, CompanyTableColumns, StuffTableColumns } from "@/constants/common";
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';
import { companyService, stuffsService } from "@/services/companyController";
import KTable from "@/components/table/KTable";
import AddItemModal from "@/components/modal/pageAddModal";
import CompanyAddModal from "@/components/modal/companyModal";

const { Option } = Select;

const CompanyIdPage = () => {
    const { id } = useParams();

    const [modalVisible, setModalVisible] = useState(false);

    
    const fetchData = async () => {
        const response = await companyService.getValuesById(id);
        const responseStuff = await stuffsService.getValues(id);
        console.log(responseStuff);
        
        console.log(response);
    }

    const renderInputComponent = (column) => {
        const { type } = column;
        let inputComponent;

        switch (type) {
            case COLUMN_TYPES.STRING:
                inputComponent = <Input placeholder={`Enter ${column.dataIndex}`} />;
                break;
            case COLUMN_TYPES.INTEGER:
            case COLUMN_TYPES.LONG:
            case COLUMN_TYPES.DOUBLE:
                inputComponent = <Input type="number" placeholder={`Enter ${column.dataIndex}`} />;
                break;
            case COLUMN_TYPES.DATE:
                inputComponent = <DatePicker style={{ width: '100%' }} placeholder={`Select ${column.dataIndex}`} />;
                break;
            case COLUMN_TYPES.SELECTION:
                inputComponent = (
                    <Select placeholder={`Select ${column.dataIndex}`}>
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

    const handleAddStuff = (values) => {
        console.log('Add stuff', values);
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
                                rules={[{ required: true, message: `Please enter ${column.dataIndex}` }]}
                            >
                                {renderInputComponent(column)}
                            </Form.Item>
                        </Col>
                    ))}
                </Row>
            </Form>
            <KTable
                rowKey="id"
                initialColumns={StuffTableColumns} 
                dataSource={[]} 
                pagination={false}
                loading={false}
                onAddClick={() => setModalVisible(true)}
                onEditClick={() => console.log('Edit stuff')}
                onDeleteClick={() => console.log('Delete stuff')}
                onUploadClick={() => console.log('Upload stuff')}
                isAdd
            />           
            <CompanyAddModal
                title="Add Stuff"
                headers={StuffTableColumns}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                setModalVisible={setModalVisible}
                onAdd={handleAddStuff}
            /> 
        </Card>
    )
};

export default CompanyIdPage;