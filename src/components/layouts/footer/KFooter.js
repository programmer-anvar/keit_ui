"use client"

import { Layout } from "antd";

const { Footer } = Layout;

const KFooter = () => {
    return (
        <Footer
            style={{
                background: "#6B758E",
            }}
        >
            <p style={{color: "white"}}>Footer</p>
        </Footer>
    );
};

export default KFooter;