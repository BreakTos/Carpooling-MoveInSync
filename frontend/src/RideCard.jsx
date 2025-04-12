import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FaCarSide,
  FaShuttleVan,
  FaTruck,
  FaUserCircle,
  FaComments,
  FaCalendarAlt,
  FaRoute,
  FaPaperPlane,
} from 'react-icons/fa';
import './RideCard.css';

const getVehicleIcon = (vehicle) => {
  const vehicleMap = {
    indigo: <FaCarSide size={22} />,
    van: <FaShuttleVan size={22} />,
    truck: <FaTruck size={22} />,
  };
  return vehicleMap[vehicle.toLowerCase()] || <FaCarSide size={22} />;
};

const getMatchLabel = (percent) => {
  if (percent >= 75) return 'Excellent Match';
  if (percent >= 50) return 'Good Match';
  if (percent > 0) return 'Low Match';
  return 'No Match';
};

export default function RideCard({ ride, activeChatId, setActiveChatId, details }) {
  const vehicleIcon = getVehicleIcon(ride.vehicle);
  const routeMatch = ride.routeMatch || 0;
  const isChatOpen = activeChatId === ride._id;

  const currentUser = localStorage.getItem('userEmail');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [bookingStatus, setBookingStatus] = useState('loading');
  const messagesEndRef = useRef(null);

  // Fetch messages from server every 5s
  useEffect(() => {
    if (!isChatOpen) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:8080/chat/messages', {
          params: {
            userA: currentUser,
            userB: ride.driver,
          },
        });
        setMessages(res.data.messages);
      } catch (err) {
        console.error('Fetching chat failed', err);
      }
    };

    fetchMessages(); // Initial load
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [isChatOpen, currentUser, ride.driver]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const prevMessagesRef = useRef([]);

  useEffect(() => {
  const prevMessages = prevMessagesRef.current;
  const newMessages = messages;

  const userJustSent = newMessages.length > prevMessages.length &&
    newMessages[newMessages.length - 1]?.senderMail === currentUser;

  if (userJustSent) {
    scrollToBottom();
  }

  prevMessagesRef.current = newMessages;
  }, [messages, currentUser]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.post('http://localhost:8080/ride/status', {
          userMail: currentUser,
          driverMail: ride.driver,
        });
        setBookingStatus(res.data.status);
      } catch (err) {
        console.error("Failed to get booking status", err);
      }
    };
  
    fetchStatus();
  }, [currentUser]);

  const handleChatToggle = () => {
    setActiveChatId(isChatOpen ? null : ride._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const message = {
      senderMail: currentUser,
      receiverMail: ride.driver,
      text: messageInput,
    };

    try {
      await axios.post('http://localhost:8080/chat/send', message);
      setMessageInput('');
    } catch (err) {
      console.error('Sending message failed', err);
    }
  };

  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const locationMsg = `📍 Location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

      try {
        await axios.post('http://localhost:8080/chat/send', {
          senderMail: currentUser,
          receiverMail: ride.driver,
          text: locationMsg,
        });
      } catch (err) {
        console.error('Sending location failed', err);
      }
    }, (error) => {
      console.error('Unable to get location', error);
      alert('Unable to retrieve location');
    });
  };

  const bookRide = async () => {
    
    const message = {
      userMail : currentUser,
      driverMail : ride.driver,
      pickup : details.pickup,
      drop: details.drop,
      departure: details.departure,
      prefs : details.prefs
    };

    try {
      
      const res = await axios.post('http://localhost:8080/ride/join',message);
      // console.log(res.data.error);
      if(res.status === 200){
        alert("book request sent");
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ride-card">
      {/* Same header and ride details */}
      <div className="ride-main">
        <div className="driver-section">
          <div className="driver-icon">{vehicleIcon}</div>
          <div className="driver-info">
            <h3><FaUserCircle style={{ marginRight: '6px' }} /> {ride.driver}</h3>
            <p><strong>Vehicle:</strong> {ride.vehicle} ({ride.plate})</p>
          </div>
        </div>
        <div className="ride-data">
          <p><strong>Departure:</strong> {new Date(ride.departure).toLocaleString()}</p>
          <p><strong>Seats Left:</strong> {ride.seats}</p>
        </div>
      </div>

      <div className="match-section">
        <div className="match-label">
          <FaRoute style={{ marginRight: '6px', color: '#3B82F6' }} />
          {getMatchLabel(routeMatch)} ({routeMatch}%)
        </div>
        <div className="match-bar-container">
          <div className="match-bar" style={{ width: `${routeMatch}%` }} />
        </div>
      </div>

      <div className="action-section">
      <button
  className={`book-btn ${bookingStatus}`}
  onClick={bookRide}
  disabled={bookingStatus !== 'none'}
>
  {bookingStatus === 'pending' && 'Request Pending'}
  {bookingStatus === 'booked' && 'Already Booked'}
  {bookingStatus === 'none' && (
    <>
      <FaCalendarAlt size={12} style={{ marginRight: '5px' }} />
      Book Now
    </>
  )}
</button>
        <button className="chat-btn" onClick={handleChatToggle}>
          <FaComments size={12} style={{ marginRight: '5px' }} />
          Chat
        </button>
      </div>

      {isChatOpen && (
        <div className="chat-interface">
          <div className="chat-header">
            <FaUserCircle style={{ marginRight: '8px' }} /> Chat with {ride.driver}
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.senderMail === currentUser ? 'sent' : 'received'}`}
              >
                <span className="message-text">{msg.text}</span>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="What time will you be passing here?"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(e);
              }}
            />
            <button type="button" onClick={handleSendLocation} className="send-btn">
              📍
            </button>
            <button type="button" onClick={handleSendMessage} className="send-btn">
              <FaPaperPlane size={14} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
