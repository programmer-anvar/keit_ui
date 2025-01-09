"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge, Layout, Space, Input, Button, Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import { BellOutlined, MailOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { fetchModuleDetails } from "@/services/moduleController";
import { useRouter } from "next/navigation";
import styles from './KHeader.module.css';
import KBreadcrumb from "@/components/breadcrumb/KBreadcrumb";
import KBookmarks from "@/components/bookmark/KBookmark";
import SelectService from "@/components/SelectService";
import logo from "../../../../public/assets/logo-01-u.png";
import { setItem } from "@/utils/persistance-storage";
import { logout } from "@/services/authController";
import { NotificationService } from "@/services/notificationController";

const { Header } = Layout;
const { Search } = Input;

const KHeader = ({
    path, setBreadcrumbs, setProcessId,
    bookmarkedBreadcrumbs, setBookmarkedBreadcrumbs, toggleCollapse, collapsed,
}) => {
    const [subModuleProcess, setSubModuleDetails] = useState([]);
    const [filteredModules, setFilteredModules] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const router = useRouter();
    
    const getSubModuleDetails = async () => {
        try {
            const { data } = await fetchModuleDetails();
            if (data?.length) {
                
                const subModules = data[0].subModuleProcess || [];
                setSubModuleDetails(subModules);
                setFilteredModules(subModules);
                setSelectedValue(subModules[0]?.id || null);
            }
        } catch (error) {
            console.error('Failed to fetch submodule details:', error);
        }
    };

    useEffect(() => {
        getSubModuleDetails();
    }, []);

    // Check if current path is bookmarked
    useEffect(() => {
        const isPathBookmarked = bookmarkedBreadcrumbs?.some(bookmark => bookmark.key === path);
        setIsFavorite(isPathBookmarked);
    }, [path, bookmarkedBreadcrumbs]);

    const handleSearch = (value) => {
        setFilteredModules(subModuleProcess.filter(
            (module) => module.serviceName.toLowerCase().includes(value.toLowerCase())
        ));
    };

    const handleBookmarkToggle = useCallback(() => {
        if (isFavorite) {
            // Remove bookmark
            const updatedBookmarks = bookmarkedBreadcrumbs.filter(bookmark => bookmark.key !== path);
            setBookmarkedBreadcrumbs(updatedBookmarks);
            setItem("bookmarkedTabs", JSON.stringify(updatedBookmarks));
        } else {
            // Add bookmark
            const pathSegments = path.split("/").filter(segment => segment);
            const title = pathSegments[pathSegments.length - 1]?.replace(/-/g, " ") || "Home";
            const newBookmark = {
                key: path,
                title,
                slug: path
            };
            const updatedBookmarks = [...bookmarkedBreadcrumbs, newBookmark];
            setBookmarkedBreadcrumbs(updatedBookmarks);
            setItem("bookmarkedTabs", JSON.stringify(updatedBookmarks));
        }
        setIsFavorite(!isFavorite);
    }, [isFavorite, path, bookmarkedBreadcrumbs, setBookmarkedBreadcrumbs]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const [notificationLength, setNotificationLength] = useState([]);
const [error, setError] = useState(null);

const getNotification = async () => {
    try {
        const response = await NotificationService.get();
        if (response?.success && Array.isArray(response?.data)) {
            const unreadNotifications = response.data.filter((item) => item?.isRead === false);
            setNotificationLength(unreadNotifications.length); 
        } else {
            setError("Failed to load notifications");
        }
    } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("An error occurred while fetching notifications");
    }
};

useEffect(() => {
    getNotification();
}, []);

    return (
        <div className={styles.header}>
            <Header className={styles.headerInner} style={{ paddingLeft: 0 }}>
                <Space className={styles.leftSection} style={{ paddingLeft: 0 }}>
                    {collapsed && (
                        <div className={styles.logoWrapper}>
                            <Link href="/sampling" className={styles.logoWrapper}>
                                <Image alt="logo" src={logo} height={40} width={100} priority />
                            </Link>
                            <MenuUnfoldOutlined className={styles.collapseIcon} onClick={toggleCollapse} />
                        </div>
                    )}
                </Space>
                <Space>
                    <Search
                        placeholder="Search services"
                        onSearch={handleSearch}
                        style={{ width: 400 }}
                        enterButton
                        className={styles.leftSection}
                    />
                </Space>
                <Space className={styles.rightSection}>
                    <SelectService
                        data={filteredModules}
                        value={selectedValue}
                        className={styles.select}
                        onChange={setProcessId}
                    />
                    {/* <Badge count={1}><MailOutlined className={styles.icon} /></Badge> */}
                    <Link href={'/notification'}>
                    <Badge count={notificationLength}><BellOutlined className={styles.icon} /></Badge>
                    </Link>
                    <Button onClick={handleLogout} icon={<UserOutlined />} type="text">Logout</Button>
                </Space>
            </Header>
            <div
                className={styles.headerBottom}
            >
                <div className={styles.headerBottomContent}>
                    <div className={styles.breadcrumbSection}>
                        <KBreadcrumb
                            path={path}
                            setBreadcrumbs={setBreadcrumbs}
                            addBookmark={handleBookmarkToggle}
                            removeBookmark={handleBookmarkToggle}
                            isFavorite={isFavorite}
                        />
                    </div>
                    {bookmarkedBreadcrumbs?.length > 0 && (
                        <div className={styles.bookmarkSection}>
                            <KBookmarks
                                bookmarkedTabs={bookmarkedBreadcrumbs}
                                setBookmarkedTabs={setBookmarkedBreadcrumbs}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KHeader;
