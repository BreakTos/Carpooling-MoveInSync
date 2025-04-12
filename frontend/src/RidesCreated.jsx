import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessagesPanel from './MessagesPanel';
import { FaCarSide, FaCalendarAlt, FaUserFriends, FaComments } from 'react-icons/fa';
import './RidesCreated.css';

export default function RidesCreated() {
  const [createdRides, setCreatedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInvites, setShowInvites] = useState(false);
  const [invites, setInvites] = useState([]);

  const ridesPerPage = 4;

  const currentUserEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchCreatedRides = async () => {
      try {
        const res = await axios.get('https://tbppp.centralindia.cloudapp.azure.com/ride/created', {
          params: { creator: currentUserEmail },
        });
        console.log(res.data.rides);
        setCreatedRides(res.data.rides || []);
      } catch (err) {
        console.error('Failed to fetch created rides:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchInvites = async () => {
        try {
          const res = await axios.get('https://tbppp.centralindia.cloudapp.azure.com/ride/invites', {
            params: { driverMail: currentUserEmail },
          });
          setInvites(res.data.invites);
        } catch (err) {
          console.error("Failed to fetch invites", err);
        }
      };
    
    fetchInvites();
    fetchCreatedRides();
  }, [currentUserEmail]);

  const handleAccept = async (userMail) => {
    try {
      await axios.post('https://tbppp.centralindia.cloudapp.azure.com/ride/accept', { userMail, driverMail: currentUserEmail });
      setInvites(prev => prev.filter(invite => invite.userMail !== userMail));
    } catch (err) {
      console.error("Accept failed", err);
    }
  };
  
  const handleDecline = async (userMail) => {
    try {
      await axios.post('https://tbppp.centralindia.cloudapp.azure.com/ride/reject', { userMail, driverMail: currentUserEmail });
      setInvites(prev => prev.filter(invite => invite.userMail !== userMail));
    } catch (err) {
      console.error("Decline failed", err);
    }
  };
  

  // Pagination logic
  const totalPages = Math.ceil(createdRides.length / ridesPerPage);
  const startIdx = (currentPage - 1) * ridesPerPage;
  const currentRides = createdRides.slice(startIdx, startIdx + ridesPerPage);

  return (
    <div className="rides-dashboard">
      <div className="rides-header">
        <h2>Your Created Rides</h2>
      </div>

      <div className="rides-grid">
        {loading ? (
          <p className="loading-msg">Loading your rides...</p>
        ) : currentRides.length === 0 ? (
          <p className="empty-msg">You haven’t created any rides yet 🛣️</p>
        ) : (
          currentRides.map((ride) => (
            <div key={ride._id} className="ride-card">
              <div className="ride-icon"><FaCarSide size={24} /></div>
              <div className="ride-info">
                <h3>{ride.pickup} → {ride.drop}</h3>
                <p><FaCalendarAlt className="icon" /> {new Date(ride.departure).toLocaleString()}</p>
                <p><FaUserFriends className="icon" /> {ride.seats} seats</p>
                <p><FaCarSide className="icon" /> {ride.vehicle} ({ride.plate})</p>
                <> {ride.completed === false ? 
                <button style={{ backgroundColor: '#10B981', color: 'white', padding: '4px 12px', fontSize: '14px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Active</button>
              : <button style={{ backgroundColor: '#3B82F6', color: 'white', padding: '4px 12px', fontSize: '14px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Completed</button>}  </>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>← Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next →</button>
        </div>
      )}

      <button className="invites-fab" onClick={() => setShowInvites(true)}>
        <FaUserFriends size={20} />
      </button>
      
      <button className="chat-fab" onClick={() => setShowMessages(true)}>
        <FaComments size={20} />
      </button>

      {showMessages && (
        <div className="chat-drawer">
          <div className="chat-drawer-header">
            <h4>Messages</h4>
            <button className="close-chat" onClick={() => setShowMessages(false)}>✕</button>
          </div>
          <MessagesPanel />
        </div>
      )}
      
        {showInvites && (
        <div className="invite-drawer">
          <div className="invite-drawer-header">
            <h4>Ride Join Requests</h4>
            <button className="close-invite" onClick={() => setShowInvites(false)}>✕</button>
          </div>
      
      {/** The invites come here */}
          <div className="invite-list">
  {invites.map((invite, index) => (
    <div className="invite-card" key={index}>
      <p>
        <strong>{invite.userMail}</strong> wants to join your ride from 
        <em> {invite.pickup} → {invite.drop}</em>
      </p>
      <div className="invite-actions">
        <button className="accept"  onClick={() => handleAccept(invite.userMail)}>Accept</button>
        <button className="decline" onClick={() => handleDecline(invite.userMail)}>Decline</button>
      </div>
    </div>
  ))}
        </div>
        </div>
      )}
      

      
    </div>
  );
}
