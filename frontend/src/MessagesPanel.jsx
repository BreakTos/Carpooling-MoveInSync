import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';
import './MessagesPanel.css';

export default function MessagesPanel() {
  const [conversations, setConversations] = useState([]);
  const [messagesMap, setMessagesMap] = useState({});
  const [messageInputs, setMessageInputs] = useState({});
  const messagesEndRef = useRef(null);

  const currentUser = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const usersRes = await axios.get('http://localhost:8080/auth/alll');
        console.log(usersRes.length);
        const users = usersRes.data.filter(u => u.email !== currentUser);

        const activeConversations = [];

        for (const user of users) {
          const res = await axios.get('http://localhost:8080/chat/messages', {
            params: { userA: currentUser, userB: user.email }
          });

          if (res.data.messages.length > 0) {
            activeConversations.push({
              user: user.email,
              messages: res.data.messages
            });
          }
        }

        const mappedMessages = {};
        activeConversations.forEach(conv => {
          mappedMessages[conv.user] = conv.messages;
        });

        setMessagesMap(mappedMessages);
        setConversations(activeConversations);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };

    fetchConversations();
  }, [currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messagesMap]);

  const handleSendMessage = async (receiverMail) => {
    const text = messageInputs[receiverMail]?.trim();
    if (!text) return;

    try {
      await axios.post('http://localhost:8080/chat/send', {
        senderMail: currentUser,
        receiverMail,
        text
      });

      // Refetch messages
      const res = await axios.get('http://localhost:8080/chat/messages', {
        params: { userA: currentUser, userB: receiverMail }
      });

      setMessagesMap(prev => ({
        ...prev,
        [receiverMail]: res.data.messages
      }));

      setMessageInputs(prev => ({
        ...prev,
        [receiverMail]: ''
      }));
    } catch (err) {
      console.error('Sending message failed', err);
    }
  };

  return (
    <div className="messages-panel-wrapper">
      <h2>Messages</h2>

      {conversations.length === 0 ? (
        <p className="no-chats">No conversations yet.</p>
      ) : (
        conversations.map(({ user }) => (
          <div key={user} className="chat-section">
            <div className="chat-header">
              <FaUserCircle className="user-icon" />
              <span>{user}</span>
            </div>

            <div className="chat-body">
              {(messagesMap[user] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`chat-msg ${msg.senderMail === currentUser ? 'sent' : 'received'}`}
                >
                  <span>{msg.text}</span>
                  <div className="msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={messageInputs[user] || ''}
                onChange={(e) =>
                  setMessageInputs(prev => ({ ...prev, [user]: e.target.value }))
                }
                placeholder="Type a message..."
              />
              <button onClick={() => handleSendMessage(user)}>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
