import React from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AllLocations.css';

const AllLocations = () => {
  const navigate = useNavigate();

  const allLocations = [
    { name: 'Ariyalur', hallCount: 12 },
    { name: 'Chennai', hallCount: 25 },
    { name: 'Coimbatore', hallCount: 18 },
    { name: 'Madurai', hallCount: 15 },
    { name: 'Trichy', hallCount: 10 },
    { name: 'Salem', hallCount: 8 },
    { name: 'Erode', hallCount: 7 },
    { name: 'Vellore', hallCount: 9 },
    { name: 'Thanjavur', hallCount: 6 },
    { name: 'Tirunelveli', hallCount: 11 }
  ];

  return (
    <div className="all-locations-container">

      <h1>📍 All Locations</h1>
      <p>Select a city to explore available halls</p>

      <div className="all-locations-grid">
        {allLocations.map((loc, index) => (
          <div
            key={index}
            className="all-location-card"
            onClick={() =>
              navigate(`/search?location=${encodeURIComponent(loc.name)}`)
            }
          >
            <MapPin size={20} />
            <h3>{loc.name}</h3>
            <span>{loc.hallCount} Halls</span>
          </div>
        ))}
      </div>

      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

    </div>
  );
};

export default AllLocations;
