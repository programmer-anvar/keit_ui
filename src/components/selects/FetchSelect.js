import React, { useState, useCallback } from 'react';
import { Select, Input, Button, Divider } from 'antd';
import debounce from 'lodash.debounce';
import FetchServices from '@/services/fetchSelectServices';
import { endsWith } from 'lodash';

const { Option } = Select;
const { Search } = Input;

const FetchSelect = ({ selectId, selectedFetch, setSelectedFetch, form }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            
            const requestParams = {
                id: selectId,
                search: "",
                page: 0,
                size: 10
            }
    
            const response = await FetchServices.getResult(requestParams)
            console.log(response);
            
            setData(response)
            
            setHasMore(response.hasMore);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced fetch to optimize performance
    const debouncedFetchData = useCallback(debounce(fetchData, 300), []);

    // Handle the select change, update form and local state
    const handleSelectChange = value => {
        form.setFieldsValue({ [selectId]: value });
        setSelectedFetch({ ...selectedFetch, [selectId]: value });
    };

    // Custom dropdown render to include search and pagination
    const dropdownRender = menu => (
        <>
            <Search
                placeholder="Search..."
                onSearch={debouncedFetchData}
                style={{ margin: '8px' }}
            />
            <Divider style={{ margin: 0 }} />
            <div style={{ maxHeight: 300, overflow: 'auto' }}>{menu}</div>
            <Divider style={{ margin: 0 }} />
            <Button
                block
                disabled={!hasMore}
                loading={loading}
                onClick={() => fetchData()} // Trigger next page load
                style={{ margin: '8px' }}
            >
                Load More
            </Button>
        </>
    );

    return (
        <Select
            labelInValue
            value={selectedFetch[selectId] ? selectedFetch[selectId] : undefined}
            placeholder="Select an option"
            onChange={handleSelectChange}
            dropdownRender={dropdownRender}
            onDropdownVisibleChange={open => {
                if (open) {
                    fetchData();
                }
            }}
        >
            {/* {
                data.map((item) => {
                    // Determine what values are available
                    let displayText = '';
                    let value = '';

                    if (item.column1 && item.column2) {
                        displayText = `${item.column1} - (${item.column2})`;
                        value = `${item.column1} - ${item.column2}`;
                    } else if (item.column1) {
                        displayText = item.column1;
                        value = item.column1;
                    } else if (item.column2) {
                        displayText = item.column2;
                        value = item.column2;
                    }

                    return displayText && value ? (
                        <Option key={value} value={value}>
                            {displayText}
                        </Option>
                    ) : null;
                })
            } */}
        </Select>
    );
};

export default FetchSelect;
