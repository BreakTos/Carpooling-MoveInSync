import React, { useState } from 'react';
import MetroSelector from './MetroSelector';
import RideCard from './RideCard';
import './JoinRideForm.css'
import axios from 'axios';

export default function JoinRideForm() {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [departure, setDeparture] = useState('');
  const [rides, setRides] = useState([]);
  const [prefs, setPrefs] = useState({
    music: false, smoking: false, pets: false
  });
  const [activeChatId, setActiveChatId] = useState(null); // ✅ manage open chat

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://tbppp.centralindia.cloudapp.azure.com/ride/find', { pickup, drop, departure, prefs });
      setRides(response.data.rides || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  return (
    <>
      <form className="ride-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <MetroSelector label="Pickup Point" selected={pickup} setSelected={setPickup} />
            <MetroSelector label="Drop Point" selected={drop} setSelected={setDrop} />
          </div>
        </div>
        <div className="prefs">
          <label><input type="checkbox" checked={prefs.music} onChange={() => setPrefs({ ...prefs, music: !prefs.music })} /> Music</label>
          <label><input type="checkbox" checked={prefs.smoking} onChange={() => setPrefs({ ...prefs, smoking: !prefs.smoking })} /> Smoking</label>
          <label><input type="checkbox" checked={prefs.pets} onChange={() => setPrefs({ ...prefs, pets: !prefs.pets })} /> Pets</label>
          <label><b>Departure</b></label>
          <input type="datetime-local" value={departure} onChange={(e) => setDeparture(e.target.value)} required />
          <button className="join-btn" type="submit">Find Rides</button>
        </div>
        {rides.length > 0 && (
          <div className="rides-list">
            {rides.map((ride, index) => (
              <RideCard
                key={index}
                ride={ride}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                details = {{pickup, drop, departure, prefs}}
              />
            ))}
          </div>
        )}
      </form>
    </>
  );
}
