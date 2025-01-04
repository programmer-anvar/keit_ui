import { Select } from "antd";

const SelectService = ({ value, onChange, data }) => {
    const options = data?.map((subModule, index) => ({
        label: subModule.name, 
        value: subModule.id,
        key: index
    }));
    
    const handleChange = (value) => {
        onChange(value);
    };
    return (
        <Select
            value={value}
            onChange={handleChange}
            allowClear
            placeholder={"-- Select Sub Module --"}
            style={{ width: 200 }}
            options={options} 
        />
    );
};

export default SelectService;
