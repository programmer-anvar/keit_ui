import React, { useEffect, useRef, useState } from 'react';
import { List } from 'antd';

const VirtualList = ({ items, itemHeight = 40, windowHeight = 400, renderItem }) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
        startIndex + Math.ceil(windowHeight / itemHeight),
        items.length
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const totalHeight = items.length * itemHeight;
    const offsetY = startIndex * itemHeight;

    const handleScroll = (e) => {
        setScrollTop(e.target.scrollTop);
    };

    return (
        <div
            ref={containerRef}
            style={{ height: windowHeight, overflow: 'auto' }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    <List
                        dataSource={visibleItems}
                        renderItem={renderItem}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(VirtualList);
