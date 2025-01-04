"use client";

import { Form } from "antd";
import KDynamicInput from "@/components/inputs/KDynamicInput";

const SamplingCollapseItem = ({ field, form, selectedFetch, setSelectedFetch, validateMode }) => {
  const value = form.getFieldValue(field.dataIndex);
  const showRequired = validateMode && field.isRequired && (!value || value === '');

  return (
    <Form.Item
      key={field.dataIndex}
      label={
        <span style={{ fontWeight: 500 }}>
          {field.name}
          {field.isRequired && <span style={{ color: '#ff4d4f' }}> *</span>}
        </span>
      }
      name={field.dataIndex}
      validateStatus={showRequired ? 'error' : ''}
      help={showRequired ? `${field.name}을(를) 입력해주세요` : ''}
      style={{ margin: 0 }}
    >
      <KDynamicInput
        field={field}
        form={form}
        selectedFetch={selectedFetch}
        setSelectedFetch={setSelectedFetch}
      />
    </Form.Item>
  );
};

export default SamplingCollapseItem;
