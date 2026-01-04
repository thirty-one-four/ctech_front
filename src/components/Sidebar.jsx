import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="logo">
                <h2>CesiumTech</h2>
            </div>
            <nav>
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    end
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/chat"
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                    Chat
                </NavLink>
                <NavLink
                    to="/ide"
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                    IDE
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                <span>v0.2.0 (Alpha)</span>
            </div>
        </div>
    );
};

export default Sidebar;
