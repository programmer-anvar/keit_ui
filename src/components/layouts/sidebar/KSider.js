"use client";
import { useState, useMemo, useCallback, memo } from "react";
import { Layout, Menu, Space } from "antd";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import styles from "./KSider.module.css";
import logo from "../../../../public/assets/logo-01-u.png";
import SiteMap from "@/components/sitemap/Sitemap";
import { MenuFoldOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

const generateMenuItems = (sitemap, serviceData, pathname) => {
    if (!Array.isArray(serviceData)) return [];

    return sitemap.reduce((acc, item) => {
        const mainService = serviceData.find(service => service.code === item.code);
        if (!mainService) return acc;

        const validChildren = (item.children || [])
            .filter(child => mainService.subServices?.some(service => service.code === child.code))
            .map(child => ({
                key: child.key,
                label: child.label,
                className: pathname === child.key ? styles.activeMenuItem : '',
            }));

        if (validChildren.length === 0) return acc;

        acc.push({
            key: item.key,
            icon: item.icon,
            label: item.label,
            className: pathname.startsWith(item.key) ? styles.activeMenuItem : '',
            children: validChildren
        });

        return acc;
    }, []);
};

const KSider = memo(({ 
    collapsed,
    toggleCollapse,
    loading 
}) => {
    const pathname = usePathname();
    const [openKeys, setOpenKeys] = useState([]);
    const serviceData = useSelector((state) => state.service.serviceData);
    const router = useRouter();

    const menuItems = useMemo(() => 
        generateMenuItems(SiteMap, serviceData, pathname), 
        [serviceData, pathname]
    );

    const handleMenuClick = useCallback(({ key, keyPath }) => {
        if (!loading) {
            // If it's a child item (has a longer keyPath), navigate
            if (keyPath.length > 1) {
                router.push(key);
            } else {
                // If it's a parent item, toggle its open state
                setOpenKeys(prev => 
                    prev.includes(key) 
                    ? prev.filter(k => k !== key)
                    : [...prev, key]
                );
            }
        }
    }, [loading, router]);

    const handleOpenChange = useCallback((keys) => {
        setOpenKeys(keys);
    }, []);

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={256}                
            className={`${styles.sider} ${loading ? styles.loading : ''}`}
        >
            <div className={styles.siderContent}>
                <div className={styles.header}>
                    <Space className={styles.header}>
                        {!collapsed && (
                            <div className={styles.logoWrapper}>
                                <Link href="/sampling" className={styles.logo}>
                                    <Image
                                        alt="logo"
                                        src={logo}
                                        height={40}
                                        width={100}
                                        priority
                                    />
                                </Link>
                                <MenuFoldOutlined
                                    onClick={toggleCollapse}
                                    className={styles.collapseIcon}
                                />
                            </div>
                        )}
                    </Space>
                </div>
                <Menu
                    mode="inline"
                    openKeys={openKeys}
                    onOpenChange={handleOpenChange}
                    onClick={handleMenuClick}
                    selectedKeys={[pathname]}
                    items={menuItems}
                    className={styles.menu}
                    inlineCollapsed={collapsed}
                />
            </div>
        </Sider>
    );
});

KSider.displayName = 'KSider';

export default KSider;
