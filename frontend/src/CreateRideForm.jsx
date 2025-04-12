import React, { useState } from 'react';
import './CreateRideForm.css';
import axios from 'axios';
import MetroSelector from './MetroSelector';

export default function CreateRideForm() {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [departure, setDeparture] = useState('');
  const [seats, setSeats] = useState(1);
  const [vehicle, setVehicle] = useState('');
  const [plate, setPlate] = useState('');
  const [prefs, setPrefs] = useState({
    music: false, smoking: false, pets: false
  });
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const driver = localStorage.getItem('userEmail');
    const rideData = { driver, pickup, drop, departure, seats, vehicle, plate, prefs };
    console.log(" pick up " + pickup) 
  try {
    const response = await axios.post('http://localhost:8080/ride/create', rideData);
    console.log("✅ Ride created:", response.data);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  } catch (error) {
    console.error("Error creating ride:", error);
  }
  };

  return (
    <>
      <form className="ride-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <MetroSelector label="Start Point" selected={pickup} setSelected={setPickup} />
            <MetroSelector label="End Point" selected={drop} setSelected={setDrop} />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Departure</label>
            <input type="datetime-local" value={departure} onChange={(e) => setDeparture(e.target.value)} required />
          </div>
          <div>
            <label>Seats</label>
            <input type="number" min="1" max="6" value={seats} onChange={(e) => setSeats(e.target.value)} required />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Vehicle Model</label>
            <input type="text" value={vehicle} onChange={(e) => setVehicle(e.target.value)} required />
          </div>
          <div>
            <label>License Plate</label>
            <input type="text" value={plate} onChange={(e) => setPlate(e.target.value)} required />
          </div>
        </div>

        <div className="prefs">
          <label><input type="checkbox" checked={prefs.music} onChange={() => setPrefs({ ...prefs, music: !prefs.music })} /> Music</label>
          <label><input type="checkbox" checked={prefs.smoking} onChange={() => setPrefs({ ...prefs, smoking: !prefs.smoking })} /> Smoking</label>
          <label><input type="checkbox" checked={prefs.pets} onChange={() => setPrefs({ ...prefs, pets: !prefs.pets })} /> Pets</label>
          <button className="submit-btn" type="submit">Create Ride</button>
        </div>
      </form>

      {showToast && (
        <div className="toast">
          ✅ Ride created successfully!
        </div>
      )}
    </>
  );
}
