"use client";

import { useEffect, useMemo } from "react";
import { Breadcrumb, Button } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import styles from "./KBreadcrumb.module.css";

const KBreadcrumb = ({ path, addBookmark, removeBookmark, isFavorite }) => {
    const { push } = useRouter();

    // Generate breadcrumb items, including "Home" as the first item
    const breadcrumbItems = useMemo(() => {
        if (!path) return [];
        const segments = path.split("/").filter((segment) => segment !== "");
        const items = segments.map((segment, index) => ({
            key: segment,
            title: (
                <span
                    onClick={() => {
                        push(`/${segments.slice(0, index + 1).join("/")}`);
                    }}
                    style={{ cursor: "pointer" }}
                >
                    {segment.replace(/-/g, " ")}
                </span>
            ),
        }));

        return [
            {
                key: "home",
                title: (
                    <span
                        onClick={() => push("/")}
                        style={{ cursor: "pointer" }}
                    >
                        홈페이지
                    </span>
                ),
            },
            ...items,
        ];
    }, [path, push]);

    return (
        <div className={styles.breadcrumbContainer}>
            {isFavorite ? (
                <StarFilled 
                    onClick={removeBookmark} 
                    className={styles.bookmarkButton} 
                    style={{ color: '#1890ff' }}
                />
            ) : (
                <StarOutlined 
                    onClick={addBookmark} 
                    className={styles.bookmarkButton} 
                />
            )}
            <Breadcrumb items={breadcrumbItems} />
        </div>
    );
};

export default KBreadcrumb;
