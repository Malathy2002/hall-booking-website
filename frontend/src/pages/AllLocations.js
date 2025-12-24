import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building, Star, Users } from 'lucide-react';
import './AllLocations.css';

const AllLocations = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // All available cities with hall counts
  const allCities = [
    {
      id: 1,
      name: 'Ariyalur',
      state: 'Tamil Nadu',
      hallCount: 12,
      popularFor: ['Weddings', 'Receptions', 'Birthdays'],
      avgPrice: 45000,
      image: 'https://picsum.photos/400/300?random=ariyalur'
    },
    {
      id: 2,
      name: 'Chennai',
      state: 'Tamil Nadu', 
      hallCount: 25,
      popularFor: ['Corporate Events', 'Weddings', 'Conferences'],
      avgPrice: 60000,
      image: 'https://picsum.photos/400/300?random=chennai'
    },
    {
      id: 3,
      name: 'Coimbatore',
      state: 'Tamil Nadu',
      hallCount: 18,
      popularFor: ['Weddings', 'Engagements', 'Parties'],
      avgPrice: 50000,
      image: 'https://picsum.photos/400/300?random=coimbatore'
    },
    {
      id: 4,
      name: 'Madurai',
      state: 'Tamil Nadu',
      hallCount: 15,
      popularFor: ['Traditional Weddings', 'Functions', 'Meetings'],
      avgPrice: 40000,
      image: 'https://picsum.photos/400/300?random=madurai'
    },
    {
      id: 5,
      name: 'Trichy',
      state: 'Tamil Nadu',
      hallCount: 10,
      popularFor: ['Weddings', 'Receptions', 'Family Functions'],
      avgPrice: 35000,
      image: 'https://picsum.photos/400/300?random=trichy'
    },
    {
      id: 6,
      name: 'Salem',
      state: 'Tamil Nadu',
      hallCount: 8,
      popularFor: ['Birthdays', 'Small Weddings', 'Gatherings'],
      avgPrice: 30000,
      image: 'https://picsum.photos/400/300?random=salem'
    },
    {
      id: 7,
      name: 'Erode',
      state: 'Tamil Nadu',
      hallCount: 7,
      popularFor: ['Business Events', 'Family Functions'],
      avgPrice: 32000,
      image: 'https://picsum.photos/400/300?random=erode'
    },
    {
      id: 8,
      name: 'Vellore',
      state: 'Tamil Nadu',
      hallCount: 9,
      popularFor: ['College Events', 'Seminars', 'Weddings'],
      avgPrice: 38000,
      image: 'https://picsum.photos/400/300?random=vellore'
    },
    {
      id: 9,
      name: 'Thanjavur',
      state: 'Tamil Nadu',
      hallCount: 6,
      popularFor: ['Cultural Events', 'Traditional Weddings'],
      avgPrice: 35000,
      image: 'https://picsum.photos/400/300?random=thanjavur'
    },
    {
      id: 10,
      name: 'Tirunelveli',
      state: 'Tamil Nadu',
      hallCount: 5,
      popularFor: ['Family Functions', 'Small Gatherings'],
      avgPrice: 30000,
      image: 'https://picsum.photos/400/300?random=tirunelveli'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLocations(allCities);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLocationClick = (cityName) => {
    navigate(`/search?location=${cityName}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading locations...</h2>
      </div>
    );
  }

  return (
    <div className="locations-container">
      {/* Header */}
      <div className="locations-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
        
        <h1>📍 All Available Locations</h1>
        <p className="subtitle">
          Browse function halls across {locations.length} cities in Tamil Nadu
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <Building size={24} />
          <div>
            <h3>{locations.reduce((sum, loc) => sum + loc.hallCount, 0)}</h3>
            <p>Total Halls</p>
          </div>
        </div>
        <div className="stat-card">
          <MapPin size={24} />
          <div>
            <h3>{locations.length}</h3>
            <p>Cities</p>
          </div>
        </div>
        <div className="stat-card">
          <Users size={24} />
          <div>
            <h3>500+</h3>
            <p>Events Booked</p>
          </div>
        </div>
        <div className="stat-card">
          <Star size={24} />
          <div>
            <h3>4.5/5</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="location-search">
        <input 
          type="text" 
          placeholder="Search for a city..."
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allCities.filter(city => 
              city.name.toLowerCase().includes(searchTerm) ||
              city.state.toLowerCase().includes(searchTerm)
            );
            setLocations(filtered);
          }}
        />
      </div>

      {/* Locations Grid */}
      <div className="locations-grid">
        {locations.map(city => (
          <div 
            key={city.id} 
            className="location-card"
            onClick={() => handleLocationClick(city.name)}
          >
            <div className="location-image">
              <img src={city.image} alt={city.name} />
              <div className="city-badge">{city.name}</div>
            </div>
            
            <div className="location-content">
              <h3>{city.name}, {city.state}</h3>
              
              <div className="location-stats">
                <div className="stat">
                  <Building size={16} />
                  <span>{city.hallCount} halls</span>
                </div>
                <div className="stat">
                  <span className="price">Avg: ₹{city.avgPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="popular-for">
                <p>Popular for:</p>
                <div className="tags">
                  {city.popularFor.map((item, index) => (
                    <span key={index} className="tag">{item}</span>
                  ))}
                </div>
              </div>
              
              <button className="explore-btn">
                Explore {city.hallCount} halls →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Map View (Simple) */}
      <div className="map-section">
        <h2>📍 Cities on Map</h2>
        <div className="simple-map">
          {locations.map(city => (
            <div 
              key={city.id} 
              className="map-point"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 70 + 15}%`
              }}
              onClick={() => handleLocationClick(city.name)}
            >
              <MapPin size={20} />
              <span className="map-tooltip">{city.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllLocations;