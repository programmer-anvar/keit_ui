'use client';

import { useCallback, useEffect, useState } from "react";
import { Card, Space } from "antd";
import KTable from "@/components/table/KTable";
import useKNotification from "@/hooks/useKNotification";
import { NotificationService } from "@/services/notificationController";
import NotificationModal from "@/components/modals/NotificationModal";
import { 
    setDataSource, 
    setTableHeaders, 
    setCreateTableHeaders, 
    setPaginate, 
    setLoading 
} from "@/redux/features/samplingSlice";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

const PageNotification = () => {
    // const { notify, contextHolder } = useKNotification();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState([]);

    

    const [modalVisible, setModalVisible] = useState(false);
    const [paginate, setPaginate] = useState({
        totalElements: 0,
        pageSize: 10,
        pageNumber: 0
    })

    const router = useRouter();
    const adjustedResourceKey = 'client-factories';
    const fetchNotifications = async (page = 0, size = 10) => {
        try {
            setLoading(true);
            const response = await NotificationService.get();
            if (response.success) { 
                setNotifications(response.data || []);
                setPaginate(prev => ({
                    ...prev,
                    totalElements: response.data.length
                }));
            } else {
                setError("Failed to load notifications");
            }
        } catch (err) {
            setError(err.message || "Error while fetching notifications");
            // notify("error", err.message || "Unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);
    const columns = [
    {
        title: "Title", 
        dataIndex: "title", 
        key: "title", 
        width: "300px", 
        render: (title, record) => (
            <a onClick={() => handleTitleClick(record.id)}>{title}</a>
        ) 
    },
    { title: "Text",
         dataIndex: "text", 
         key: "text",
          width: "300px",
          render: (text, record) => (
            <a onClick={() => handleTitleClick(record.id)}>{text}</a>
        ) 
         },
          
    { title: "Sent Time", dataIndex: "sentTime", key: "sentTime", width: "300px" },
];

    const handleTableChange = useCallback((pagination) => {
        setPaginate(prev => ({
            ...prev,
            pageNumber: pagination.current - 1,
            pageSize: pagination.pageSize
        }));
    }, []);
    const handleSelectionChange = (keys) => {
        setSelectedKeys(keys);
    };

     const handleAddEmployee = async (value) => {
            try {
                console.log(value);
                setModalVisible(false)
            } catch (err) {
                // notify("error", "Error: " + (err.message || "Unknown error"));
            }
        };

        const handleTitleClick = (id) => {
            router.push(`/notification/${id}`); 
        };
        console.log(notifications);
        

    return (
        <Space
            direction="vertical"
            size={10}
            style={{
                minWidth: 300,
                width: "100%",
                background: "#E9ECF4",
                padding: "0",
            }}
        >
            
            {/* {contextHolder} */}
            <Card style={{ padding: "1px" }}>
                <KTable
                rowKey="id"
                dataSource={notifications}
                initialColumns={columns}
                size="small"
                loading={loading}
                onSelectionChange={setSelectedKeys}
                route={adjustedResourceKey}
                isAdd={true}
                onAddClick={() => setModalVisible(true)}
                tableParams={paginate}
                onTableChange={handleTableChange}
                isSampling={true}
                />
                 <NotificationModal
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                // employeeData={newEmployeeData}
                // setEmployeeData={setNewEmployeeData}
            /> 
            </Card>
        </Space>
    );
};

export default PageNotification;
