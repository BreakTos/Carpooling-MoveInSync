import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Emergency.css';


export default function EmergencyTab() {
  const [family, setFamily] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const currentUser = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const res = await axios.get('http://localhost:8080/auth/family', {
          params: { userEmail: currentUser },
        });
        setFamily(res.data.family || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFamily();
  }, [currentUser]);

  const addContact = async () => {
    if (!newEmail.trim()) return;
    try {
      const res = await axios.post('http://localhost:8080/auth/addfamily', {
        userEmail: currentUser,
        familyEmail: newEmail,
      });
      setFamily(res.data.family);
      setNewEmail('');
    } catch (err) {
      console.error(err);
    }
  };

  const sendSOS = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
  
      try {
        await axios.post('http://localhost:8080/auth/sos', {
          userEmail: currentUser,
          location: {
            latitude,
            longitude,
          },
        });
        alert('🚨 SOS sent with your location!');
      } catch (err) {
        console.error(err);
        alert('Failed to send SOS');
      }
    }, (error) => {
      console.error(error);
      alert('Unable to get your location');
    });
  };
  
  return (
    <div className="emergency-tab">
      <h2>🚨 Emergency Contacts</h2>

      {family.length === 0 ? (
        <p>No contacts added. Add one below.</p>
      ) : (
        <>
          <ul className="family-list">
            {family.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
          <button className="sos-btn" onClick={sendSOS}>
            Send SOS
          </button>
        </>
      )}

      <div className="add-contact">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter family member's email"
        />
        <button onClick={addContact}>Add Contact</button>
      </div>
    </div>
  );
}
