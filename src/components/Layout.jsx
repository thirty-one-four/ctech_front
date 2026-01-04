import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SpaceBackground from './SpaceBackground';
import Sidebar from './Sidebar';

const Layout = () => {
    const [isHoveringUI, setIsHoveringUI] = useState(false);

    return (
        <>
            <SpaceBackground isHoveringUI={isHoveringUI} />
            <div className="layout-container">
                <Sidebar />
                <main className="main-content">
                    <div className="glass-panel">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
};

export default Layout;
