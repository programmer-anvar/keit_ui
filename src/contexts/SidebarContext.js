// contexts/SidebarContext.js
import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [sideData, setSideData] = useState([]);

    return (
        <SidebarContext.Provider value={{ sideData, setSideData }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);
