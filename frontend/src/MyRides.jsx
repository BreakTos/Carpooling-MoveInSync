import React, { useState } from 'react';
import RidesCreated from './RidesCreated'; 
import './MyRides.css';

export default function MyRides() {
  const [activeTab, setActiveTab] = useState('created');

  return (
    <div className="myrides-box">
      <div className="tab-toggle">
        <button
          className={`tab ${activeTab === 'created' ? 'active' : ''}`}
          onClick={() => setActiveTab('created')}
        >
          Rides Created
        </button>
        <button
          className={`tab ${activeTab === 'joined' ? 'active' : ''}`}
          onClick={() => setActiveTab('joined')}
        >
          Rides Joined
        </button>
      </div>

      <div className="rides-content">
        {activeTab === 'created' ? (
          < RidesCreated />
        ) : (
          <h2>🧍 Rides You've Joined</h2>
        )}
      </div>
    </div>
  );
}
