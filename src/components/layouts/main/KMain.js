"use client";

import { Layout } from "antd";
import styles from './KMain.module.css';
import { memo } from 'react';
import { useRouter } from 'next/navigation';

const { Content } = Layout;

const KMain = memo(({ children }) => {
    const router = useRouter();
    return (
      <Content className={styles.mainContent}>
            {/* <div className={styles.contentWrapper}> */}
                {children}
            {/* </div> */}
        </Content>
    );
});

KMain.displayName = 'KMain';

export default KMain;
