import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRideForm from './CreateRideForm';
import JoinRideForm from './JoinRideForm';
import MyRides from './MyRides';
import EmergencyTab from './Emergency';
import './Home.css'

function Home() {
  const [activeTab, setActiveTab] = useState('create');
  const [userMail, setUserMail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userEmail');
    if (storedUser) {
      setUserMail(storedUser);
    } else {
      navigate('/auth'); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/auth');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateRideForm/>;
      case 'join':
        return <JoinRideForm/>;
      case 'myrides':
        return <MyRides/>;
      case 'emergency':
        return <EmergencyTab/>;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="profile">
          <img src="https://i.pravatar.cc/60" alt="Profile" />
          <p className="name">{userMail}</p>
          <p className="role">User</p>
          <button className="logout-btn" onClick={handleLogout}>🔓 Logout</button>
        </div>
        <nav className="nav-menu">
          <button
            className={activeTab === 'create' ? 'active' : ''}
            onClick={() => setActiveTab('create')}
          >
            🚗 Create Ride
          </button>
          <button
            className={activeTab === 'join' ? 'active' : ''}
            onClick={() => setActiveTab('join')}
          >
            👥 Join Ride
          </button>
          <button
            className={activeTab === 'myrides' ? 'active' : ''}
            onClick={() => setActiveTab('myrides')}
          >
            📜 My Rides
          </button>
          <button
            className={activeTab === 'emergency' ? 'active' : ''}
            onClick={() => setActiveTab('emergency')}
          >
            🚨 Emergency
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Welcome, {userMail}!</h1>
          <p>Your carpool dashboard.</p>
          </header>
        <section className="dashboard">{renderContent()}</section>
      </main>
    </div>
  );
}

export default Home;
