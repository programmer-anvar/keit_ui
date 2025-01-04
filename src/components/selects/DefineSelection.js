import React from "react";
const { Select, Form } = require("antd")

const { Option } = Select;

const DefineSelection = ({select}) => {
    
    return (
        <Form.Item
            
        >
            <Select>
                {select?.map((group) =>
                    group.values.map((option) => (
                        <Option key={option.id} value={option.id}>
                            {option.value}
                        </Option>
                    ))
                )}

            </Select>
        </Form.Item>
    )
}

export default DefineSelection;