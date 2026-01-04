import React from 'react';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1>Welcome, Commander.</h1>
            <p className="subtitle">System Status: Online</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Assignments</h3>
                    <p className="stat-value">3 Pending</p>
                </div>
                <div className="stat-card">
                    <h3>Focus Time</h3>
                    <p className="stat-value">2h 15m</p>
                </div>
                <div className="stat-card">
                    <h3>Next Class</h3>
                    <p className="stat-value">CS50 - 14:00</p>
                </div>
            </div>

            <h2 style={{ marginTop: '2rem' }}>Quick Links</h2>
            <div className="link-grid">
                <a href="#" className="link-card">📚 Library</a>
                <a href="#" className="link-card">📅 Calendar</a>
                <a href="#" className="link-card">📝 Notes</a>
                <a href="#" className="link-card">☁️ Drive</a>
            </div>
        </div>
    );
};

export default Dashboard;
