import React from 'react';
import './MetroSelector.css';

const stops = [
  "Jammu", "UttarPradesh", "Maharashtra",
  "Goa", "TamilNadu", "SriLanka"
];

export default function MetroSelector({ label, selected, setSelected }) {
  return (
    <div className="metro-selector">
      <label className="metro-label">{label}</label>
      <div className="metro-line">
        {stops.map((stop, index) => (
          <div
            key={index}
            className={`metro-stop ${selected === stop ? 'selected' : ''}`}
            onClick={() => setSelected(stop)}
          >
            <div className="marker" />
            <span className="stop-name">{stop}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
