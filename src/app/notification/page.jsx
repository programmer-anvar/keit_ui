"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, Space, Input } from "antd"; // Import Input for search
import KTable from "@/components/table/KTable";
import { NotificationService } from "@/services/notificationController";
import NotificationModal from "@/components/modals/NotificationModal";
import { usePathname, useRouter } from "next/navigation";
import { FolderOpenOutlined, MailOutlined} from '@ant-design/icons';
const PageNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [paginate, setPaginate] = useState({
    totalElements: 0,
    pageSize: 10,
    pageNumber: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const adjustedResourceKey = "client-factories";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.get(); 
      if (response.success) {
        setNotifications(response?.data || []);
        setPaginate((prev) => ({
          ...prev,
          totalElements: response.data.length,
        }));
      } else {
        setError("Failed to load notifications");
      }
    } catch (err) {
      setError(err.message || "Error while fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

  }, []);
  const columns = [
    {
        title: "readnt ",
        dataIndex: "isRead",
        key: "isRead",
        width: "60px",
        render: (isRead, record) => (
            <a
              onClick={() => handleTitleClick(record.id)}
            >
              {isRead === true ? <FolderOpenOutlined /> : <MailOutlined />}
            </a>
          ),
      },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "300px",
      render: (title, record) => (
        <a
          onClick={() => handleTitleClick(record.id)}
        >
          {title}
        </a>
      ),
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
      width: "300px",
      render: (text, record) => (
        <a onClick={() => handleTitleClick(record.id)}>{text}</a>
      ),
    },
    {
      title: "Sent Time",
      dataIndex: "sentTime",
      key: "sentTime",
      width: "300px",
    },
  ];
  const handleTableChange = useCallback((pagination) => {
    setPaginate((prev) => ({
      ...prev,
      pageNumber: pagination.current - 1,
      pageSize: pagination.pageSize,
    }));
  }, []);

  const handleTitleClick = (id) => {
    router.push(`/notification/${id}`);
  };
  const onSearch = async (keyWord) => {
    if (keyWord) {
      setLoading(true);
      try {
        const response = await NotificationService.searchMessage(keyWord);
        
        if (response.success) {
          setNotifications(response.data || []);
          setPaginate((prev) => ({
            ...prev,
            totalElements: response.data.length,
          }));
        } else {
          setError("Failed to search notifications");
        }
      } catch (err) {
        setError(err.message || "Error while searching notifications");
      } finally {
        setLoading(false);
      }
    } else {
      fetchNotifications();
    }
  };

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
      <Card style={{ padding: "1px" }}>
        <Input.Search 
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
          style={{
            width: "100%",
            marginBottom:"15px"
          }}
        />
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
        />
      </Card>
    </Space>
  );
};

export default PageNotification;
