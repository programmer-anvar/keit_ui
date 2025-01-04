"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button, Card, Collapse, Form, Space, message, Layout, Progress, Spin, Row, Col } from "antd";
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import { getOrgId } from "@/utils/authHelper";

import KDynamicInput from "@/components/inputs/KDynamicInput";
import KMatrixTable from "@/components/table/KMatrixTable";
import SamplingCollapseItem from "@/components/sampling/SamplingCollapseItem";
import { MatrixService, SamplingController, SamplingMeasurementController, SamplingResultController } from "@/services/samplingController";
import dayjs from "dayjs";
import { samplingInputs } from "./samplingInputs";

const { Panel } = Collapse;

const COLLAPSE_KEYS = {
    BASIC: '1',
    MEASUREMENT: '2',
    RESULT: '3',
    MATRIX: '4',
    FACILITY: '5',
    MEMO: '6',
    STATES: '7',
};

const SamplingEditPage = ({ params: { id } }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [measurementFields, setMeasurementFields] = useState([]);
    const [resultFields, setResultFields] = useState([]);
    const [progress, setProgress] = useState(0);
    const [samplingForm] = Form.useForm();
    const [measurementForm] = Form.useForm();
    const [resultForm] = Form.useForm();
    const [matrixColumns, setMatrixColumns] = useState([]);
    const [matrixData, setMatrixData] = useState([]);
    const [selectedFetch, setSelectedFetch] = useState({});
    const [initialMeasurementValues, setInitialMeasurementValues] = useState({});
    const [initialMatrixData, setInitialMatrixData] = useState([]);
    const [matrixChanges, setMatrixChanges] = useState([]);

    // Progress calculation
    const calculateProgress = useCallback((fields, values) => {
        if (!fields.length) return 0;
        const filledFields = fields.filter(field => {
            const value = values[field.dataIndex];
            return value !== undefined && value !== '' && value !== null;
        });
        setProgress(Math.round((filledFields.length / fields.length) * 100));
    }, []);

    // Data fetching
    const fetchSamplingData = useCallback(async () => {
        try {
            setLoading(true);
            const [samplingResponse, measurementResponse, resultResponse] = await Promise.all([
                SamplingController.getValueById(id),
                SamplingMeasurementController.getSamplingMeasurements(id),
                SamplingResultController.getSamplingResults(id)
            ]);

            if (Array.isArray(samplingResponse)) {
                const fields = samplingResponse.map(line => ({
                    dataIndex: `dataIndex-${line.index}`,
                    name: line.showName || line.name,
                    columnType: line.type,
                    isRequired: line.isRequired,
                    value: line.value,
                    id: line.index,
                    order: line.order,
                    objectId: line.objectId,
                    ...line
                })).sort((a, b) => (a.order || 0) - (b.order || 0));
                
                setFormFields(fields);
                
                const samplingValues = {};
                fields.forEach(field => {
                    if (field.value !== undefined && field.value !== null) {
                        samplingValues[field.dataIndex] = field.value;
                    }
                });
                samplingForm.setFieldsValue(samplingValues);
            }

            if (Array.isArray(measurementResponse)) {
                const measurements = measurementResponse.map(line => ({
                    dataIndex: `dataIndex-${line.index}`,
                    name: line.showName || line.name,
                    columnType: line.type,
                    isRequired: line.isRequired,
                    value: line.value,
                    id: line.index,
                    order: line.order,
                    objectId: line.objectId,
                    ...line
                })).sort((a, b) => (a.order || 0) - (b.order || 0));

                setMeasurementFields(measurements);

                const measurementValues = {};
                measurements.forEach(field => {
                    if (field.value !== undefined && field.value !== null) {
                        measurementValues[field.dataIndex] = field.value;
                    }
                });
                measurementForm.setFieldsValue(measurementValues);
                setInitialMeasurementValues(measurementValues);
            }

            if (Array.isArray(resultResponse)) {
                const results = resultResponse.map(line => ({
                    dataIndex: `dataIndex-${line.index}`,
                    name: line.showName || line.name,
                    columnType: line.type,
                    isRequired: line.isRequired,
                    value: line.value,
                    id: line.index,
                    order: line.order,
                    objectId: line.objectId,
                    ...line
                })).sort((a, b) => (a.order || 0) - (b.order || 0));

                setResultFields(results);

                const resultValues = {};
                results.forEach(field => {
                    if (field.value !== undefined && field.value !== null) {
                        resultValues[field.dataIndex] = field.value;
                    }
                });
                resultForm.setFieldsValue(resultValues);
            }

            // Calculate progress with all fields
            const allFields = [
                ...(Array.isArray(samplingResponse) ? samplingResponse : []),
                ...(Array.isArray(measurementResponse) ? measurementResponse : []),
                ...(Array.isArray(resultResponse) ? resultResponse : [])
            ];
            const allValues = {
                ...samplingForm.getFieldsValue(),
                ...measurementForm.getFieldsValue(),
                ...resultForm.getFieldsValue()
            };
            calculateProgress(allFields, allValues);

        } catch (error) {
            console.error('Error fetching data:', error);
            // message.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [id, samplingForm, measurementForm, resultForm, calculateProgress]);

    const fetchMatrixColumns = useCallback(async () => {
        try {
            const response = await MatrixService.getColumns();
            if (response) {
                const sortedColumns = response
                    .sort((a, b) => a.columnOrder - b.columnOrder)
                    .map(col => ({
                        title: col.showName || col.name,
                        dataIndex: `col-${col.id}`,
                        key: col.id,
                        unit: col.unit,
                        width: 150,
                        editable: true,
                        ...col
                    }));

                setMatrixColumns(sortedColumns);
            
                const formattedData = Array.from({ length: 5 }, (_, rowIndex) => {
                    const rowNumber = rowIndex + 1;
                    const rowObject = sortedColumns.reduce((acc, col) => {
                        const cellData = col?.samplingMatrixValues?.find(item => item.rowNumber === rowNumber);
                        acc[col.dataIndex] = cellData ? cellData.value : '';
                        return acc;
                    }, { key: `row-${rowNumber}`, rowNum: rowNumber });
                    return rowObject;
                });
                
                setMatrixData(formattedData);

            }
        } catch (error) {
            console.error("Failed to fetch matrix columns:", error);
            // message.error("Failed to fetch matrix columns");
        }
    }, []);

    // Initial data load
    useEffect(() => {
        if (id) {
            fetchSamplingData();
            fetchMatrixColumns();
            // fetchMatrixData();
        }
    }, [id, fetchSamplingData, fetchMatrixColumns]);

    const handleMatrixDataChange = useCallback((newData) => {
        const changes = [];
    
        newData.forEach((newRow, rowIndex) => {
            const originalRow = matrixData.find(row => row.key === newRow.key);
            if (!originalRow) return; // Skip if no original row is found
    
            Object.keys(newRow).forEach(columnKey => {
                if (columnKey.startsWith('col-')) { // Assuming column keys start with 'col-'
                    const newValue = newRow[columnKey];
                    const originalValue = originalRow[columnKey];
    
                    if (newValue !== originalValue) {
                        changes.push({
                            columnId: Number(columnKey.slice(4)),
                            values: [
                                {
                                    rowNumber: newRow.rowNum,
                                    value: Number(newValue),
                                    samplingId: id
                                }
                            ],
                        });
                    }
                }
            });
        });
        setMatrixChanges(changes);
    }, [matrixData]);

    const handleSubmit = async () => {
        try {
            // Validate all forms
            await Promise.all([
                samplingForm.validateFields(),
                measurementForm.validateFields(),
                resultForm.validateFields()
            ]);

            const currentSamplingValues = samplingForm.getFieldsValue();
            const currentMeasurementValues = measurementForm.getFieldsValue();
            const currentResultValues = resultForm.getFieldsValue();

            const updatePromises = [];

            // Sampling data update
            const samplingValueLines = formFields
                .filter(field => {
                    const currentValue = currentSamplingValues[field.dataIndex];
                    const initialValue = field.value; // Using field.value as initial value
                    return currentValue !== undefined && currentValue !== initialValue;
                })
                .reduce((acc, field) => {
                    if (id) {
                        acc.objectId = Number(id);
                    }
                    if (field.index !== undefined) {
                        acc.valueLines.push({
                            defineId: field.index,
                            value: currentSamplingValues[field.dataIndex]
                        });
                    }
                    return acc;
                }, { objectId: null, valueLines: [] });

            if (samplingValueLines.valueLines.length > 0) {
                updatePromises.push(
                    SamplingController.updateValues(samplingValueLines)
                );
            }

            // Measurement data update
            const measurementValueLines = measurementFields
                .filter(field => {
                    // Only include fields that have changed from their initial values
                    const currentValue = currentMeasurementValues[field.dataIndex];
                    const initialValue = initialMeasurementValues[field.dataIndex];
                    return currentValue !== undefined && currentValue !== initialValue;
                })
                .reduce((acc, field) => {
                    if (field.objectId) {
                        acc.objectId = field.objectId;
                    }
                    console.log(acc, field);
                    
                    if (field.index !== undefined) {
                        acc.valueLines.push({
                            defineId: field.index,
                            value: currentMeasurementValues[field.dataIndex]
                        });
                    }
                    
                    return acc;
                }, { objectId: null, valueLines: [] });
            
            if (measurementValueLines.valueLines.length > 0) {
                updatePromises.push(
                    SamplingMeasurementController.addSamplingMeasurement(measurementValueLines, id)
                );
            }

            // Result data update
            const resultValueLines = resultFields
                .filter(field => {
                    const currentValue = currentResultValues[field.dataIndex];
                    const initialValue = field.value; // Using field.value as initial value
                    return currentValue !== undefined && currentValue !== initialValue;
                })
                .reduce((acc, field) => {
                    if (field.objectId) {
                        acc.objectId = field.objectId;
                    }
                    if (field.index !== undefined) {
                        acc.valueLines.push({
                            defineId: field.index,
                            value: currentResultValues[field.dataIndex]
                        });
                    }
                    return acc;
                }, { objectId: null, valueLines: [] });

            if (resultValueLines.valueLines.length > 0) {
                updatePromises.push(
                    SamplingResultController.addSamplingResult(resultValueLines, id)
                );
            }
            
            // Matrix data update
            if (matrixChanges.length > 0) {
                updatePromises.push(
                    MatrixService.updateSamplingValues(id, matrixChanges)
                );
            }

            console.log('Sending updates for all forms:', updatePromises);

            await Promise.all(updatePromises);
            
            // router.push('/sampling');
            // message.success('Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error);
            // message.error('Error saving data');
        }
    };
    
    const renderFormFields = useCallback((fields, form) => (
        <Form
            form={form}
            layout="vertical"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            size="small"
            style={{ padding: '8px' }}
        >
            <Row gutter={[8, 4]}>
                {fields.map((field) => (
                    <Col key={field.id} xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            label={field.label || field.name}
                            name={field.dataIndex}
                            style={{ marginBottom: 4 }}
                        >
                            <KDynamicInput 
                                field={field}
                                form={form}
                                selectedFetch={selectedFetch}
                                setSelectedFetch={setSelectedFetch}
                                size="small"
                            />
                        </Form.Item>
                    </Col>
                ))}
            </Row>
        </Form>
    ), [selectedFetch, setSelectedFetch]);

    const collapseItems = useMemo(() => [
        {
            key: 'sampling',
            label: 'Sampling Data',
            children: renderFormFields(samplingInputs, samplingForm)
        },
        {
            key: 'measurement',
            label: 'Measurement Data',
            children: renderFormFields(measurementFields, measurementForm)
        },
        {
            key: 'result',
            label: 'Result Data',
            children: renderFormFields(resultFields, resultForm)
        },
        {
            key: 'matrix',
            label: 'Matrix Data',
            children: (
                <div style={{ padding: '8px' }}>
                    <KMatrixTable
                        size="small"
                        columns={matrixColumns}
                        dataSource={matrixData}
                        onDataChange={handleMatrixDataChange} // Pass the callback here
                    />
                </div>
            )
        }
    ], [formFields, measurementFields, resultFields, samplingForm, measurementForm, resultForm, 
        renderFormFields, matrixColumns, matrixData, handleMatrixDataChange]);

    return (
        <div style={{ padding: '16px' }}>
            <Card
                size="small"
                title="샘플링 상세"
                extra={
                    <Space size="small">
                        <Button 
                            size="small"
                            icon={<RollbackOutlined />} 
                            onClick={() => router.push('/sampling')}
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
                <Spin spinning={loading}>
                    <Space 
                        direction="vertical" 
                        style={{ width: '100%'  }} 
                        size={"small"}
                    >
                        <Collapse 
                            defaultActiveKey={['1', '2', '3', '4']} 
                            size="small"
                            items={collapseItems}
                        />
                    </Space>
                </Spin>
            </Card>
        </div>
    );
};

export default SamplingEditPage;
