"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
    setPageLoading, 
    toggleCollapse, 
    setProcessId, 
    selectLayoutState 
} from "@/store/layoutSlice";
import { setServiceData } from "@/store/serviceSlice";
import { Layout, Spin, message } from "antd";
import dynamic from 'next/dynamic';
import { fetchServices } from "@/services/serviceController";
import { usePathname, useRouter } from "next/navigation";
import { getItem, setItem } from "@/utils/persistance-storage";
import { removeItem } from "@/utils/requestHelper";
import SiteMap from "@/components/sitemap/Sitemap";

const BOOKMARK_KEY = "bookmarkedTabs";

const KSider = dynamic(() => import('./sidebar/KSider'), {
    loading: () => <div style={{ width: 256 }} />,
    ssr: false
});

const KHeader = dynamic(() => import('./header/KHeader'), {
    loading: () => <div style={{ height: 64 }} />,
    ssr: false
});

const KFooter = dynamic(() => import('./footer/KFooter'), {
    loading: () => <div style={{ height: 64 }} />,
    ssr: false
});

const KMain = dynamic(() => import('./main/KMain'), {
    loading: () => <div style={{ height: 64 }} />,
    ssr: false
});

const MainLayout = ({ children }) => {
    const router = useRouter();
    const abortController = useRef(null);
    const [currentElement, setCurrentElement] = useState(null);

    const dispatch = useDispatch();
    const { 
        pageLoading, 
        collapsed, 
        processId 
    } = useSelector(selectLayoutState);
    const serviceData = useSelector((state) => state.service.serviceData);

    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [bookmarkedBreadcrumbs, setBookmarkedBreadcrumbs] = useState(() => {
        try {
            const saved = getItem(BOOKMARK_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            removeItem(BOOKMARK_KEY);
            return [];
        }
    });

    const pathname = usePathname();

    const layoutStyle = useMemo(() => ({
        minHeight: "100vh",
        height: "100vh",
        overflow: "hidden"
    }), []);

    const contentLayoutStyle = useMemo(() => ({
        marginLeft: collapsed ? "80px" : "256px",
        transition: "margin-left 0.2s"
    }), [collapsed]);

    const spinContainerStyle = useMemo(() => ({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    }), []);

    const handleToggleCollapse = useCallback(() => {
        dispatch(toggleCollapse());
    }, [dispatch]);

    const handleSetProcessId = useCallback((newProcessId) => {
        dispatch(setProcessId(newProcessId));
    }, [dispatch]);

    const findSitemapElement = useCallback((path) => {
        // First check main items
        const mainItem = SiteMap.find(item => item.key === path);
        if (mainItem?.element) {
            return mainItem.element;
        }

        // Then check children
        for (const item of SiteMap) {
            if (item.children) {
                const childItem = item.children.find(child => child.key === path);
                if (childItem?.element) {
                    return childItem.element;
                }
            }
        }
        return null;
    }, []);

    useEffect(() => {
        const fetchServicesData = async () => {
            dispatch(setPageLoading(true));
            try {
                const response = await fetchServices(processId);
                if (response?.data && Array.isArray(response.data)) {
                    try {
                        const serializedData = JSON.parse(JSON.stringify(response.data));
                        dispatch(setServiceData(serializedData));
                    } catch (error) {
                        console.error('Error serializing service data:', error);
                    }
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                dispatch(setPageLoading(false));
            }
        };

        fetchServicesData();
    }, [processId, dispatch]);

    // Loading timeout
    useEffect(() => {
        if (!pageLoading) return;

        const loadingTimeout = setTimeout(() => {
            dispatch(setPageLoading(false));
        }, 10000);
        
        return () => clearTimeout(loadingTimeout);
    }, [pageLoading, dispatch]);

    // Update current element when pathname changes
    useEffect(() => {
        const element = findSitemapElement(pathname);
        if (element) {
            setCurrentElement(element);
        }
    }, [pathname, findSitemapElement]);

    // Save bookmarks
    useEffect(() => {
        setItem(BOOKMARK_KEY, JSON.stringify(bookmarkedBreadcrumbs));
    }, [bookmarkedBreadcrumbs]);

    return (
        <Layout style={layoutStyle}>
            <KSider
                collapsed={collapsed}
                toggleCollapse={handleToggleCollapse}
                loading={pageLoading}
                username="Super Admin"
                pathname={pathname}
            />
            <Layout style={contentLayoutStyle}>
                <KHeader
                    path={pathname}
                    setBreadcrumbs={setBreadcrumbs}
                    collapsed={collapsed}
                    toggleCollapse={handleToggleCollapse}
                    setProcessId={handleSetProcessId}
                    bookmarkedBreadcrumbs={bookmarkedBreadcrumbs}
                    setBookmarkedBreadcrumbs={setBookmarkedBreadcrumbs}
                />
                <Spin spinning={pageLoading}>
                    <KMain>
                        {currentElement || children}
                    </KMain>
                </Spin>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
