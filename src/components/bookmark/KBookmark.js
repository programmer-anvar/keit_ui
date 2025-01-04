"use client";

import { Divider } from "antd";
import React, { useRef, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Link from "next/link";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import styles from './KBookmarks.module.css';

const BookmarkType = "BOOKMARK";

const DraggableBookmark = ({ bookmark, index, moveBookmark, removeBookmark }) => {
    const ref = useRef(null);
    const [{ isDragging }, drag] = useDrag({
        type: BookmarkType,
        item: { id: bookmark.key, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: BookmarkType,
        hover: (item, monitor) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientX = clientOffset.x - hoverBoundingRect.left;

            if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
                return;
            }

            moveBookmark(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));

    return (
        <div 
            ref={ref} 
            className={styles.bookmarkItemWrapper} 
            style={{ opacity }}
            data-testid="bookmark-item"
        >
            <Link href={bookmark.slug} className={styles.bookmarkItem}>
                <MenuOutlined className={styles.dragHandle} />
                <span className={styles.bookmarkText}>{bookmark.title}</span>
            </Link>
            <CloseOutlined 
                className={styles.removeButton} 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeBookmark(bookmark.key);
                }}
            />
        </div>
    );
};

const KBookmarks = ({ bookmarkedTabs, setBookmarkedTabs }) => {
    const moveBookmark = useCallback((fromIndex, toIndex) => {
        const updated = [...bookmarkedTabs];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        setBookmarkedTabs(updated);
        localStorage.setItem("bookmarkedTabs", JSON.stringify(updated));
    }, [bookmarkedTabs, setBookmarkedTabs]);

    const removeBookmark = useCallback((bookmarkKey) => {
        const updatedBookmarks = bookmarkedTabs.filter(bookmark => bookmark.key !== bookmarkKey);
        setBookmarkedTabs(updatedBookmarks);
        localStorage.setItem("bookmarkedTabs", JSON.stringify(updatedBookmarks));
    }, [bookmarkedTabs, setBookmarkedTabs]);

    return (
        bookmarkedTabs.length ? (
            <DndProvider backend={HTML5Backend}>
                <div className={styles.bookmarksContainer}>
                    {bookmarkedTabs.map((bookmark, index) => (
                        <React.Fragment key={bookmark.key}>
                            {index > 0 && <Divider type="vertical" />}
                            <DraggableBookmark 
                                bookmark={bookmark} 
                                index={index} 
                                moveBookmark={moveBookmark}
                                removeBookmark={removeBookmark}
                            />
                        </React.Fragment>
                    ))}
                </div>
            </DndProvider>
        ) : null
    );
};

export default KBookmarks;
