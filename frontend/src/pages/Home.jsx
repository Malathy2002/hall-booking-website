import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    location: '',
    eventDate: '',
    guests: '',
    eventType: ''
  });

  const [loading, setLoading] = useState(false);

  // Available cities
  const availableCities = [
    'Ariyalur', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy',
    'Salem', 'Erode', 'Vellore', 'Thanjavur', 'Tirunelveli'
  ];

  // Event types
  const eventTypes = [
    { id: 'wedding', name: 'Wedding', icon: '💒' },
    { id: 'birthday', name: 'Birthday', icon: '🎂' },
    { id: 'corporate', name: 'Corporate', icon: '💼' },
    { id: 'reception', name: 'Reception', icon: '🎉' },
    { id: 'engagement', name: 'Engagement', icon: '💍' },
    { id: 'party', name: 'Party', icon: '🎊' }
  ];

  // Categories
  const categories = [
    { name: 'Wedding Venues', count: 45, icon: '💒' },
    { name: 'Birthday Halls', count: 32, icon: '🎂' },
    { name: 'Corporate Events', count: 28, icon: '💼' },
    { name: 'Party Places', count: 36, icon: '🎉' }
  ];

  // Popular locations
  const popularLocations = [
    { name: 'Ariyalur', hallCount: 12 },
    { name: 'Chennai', hallCount: 25 },
    { name: 'Coimbatore', hallCount: 18 },
    { name: 'Madurai', hallCount: 15 },
    { name: 'Trichy', hallCount: 10 },
    { name: 'Salem', hallCount: 8 },
    { name: 'Erode', hallCount: 7 },
    { name: 'Vellore', hallCount: 9 }
  ];

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    const params = new URLSearchParams();
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.guests) params.append('guests', searchData.guests);
    if (searchData.eventType) params.append('eventType', searchData.eventType);
    if (searchData.eventDate) params.append('date', searchData.eventDate);

    navigate(`/search?${params.toString()}`);
    setLoading(false);
  };

  const quickSearch = (location, guests) => {
    setSearchData(prev => ({
      ...prev,
      location,
      guests: guests.toString()
    }));
  };

  return (
    <div className="home-container">

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Function Hall</h1>
          <p>Book beautiful venues for weddings, birthdays, corporate events and more</p>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="form-grid">

              <div className="form-group">
                <label><MapPin size={18} /> Location</label>
                <select
                  name="location"
                  value={searchData.location}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select City</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label><Calendar size={18} /> Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  value={searchData.eventDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label><Users size={18} /> Guests</label>
                <input
                  type="number"
                  name="guests"
                  value={searchData.guests}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Event Type</label>
                <select
                  name="eventType"
                  value={searchData.eventType}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">All Events</option>
                  {eventTypes.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.icon} {event.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <button type="submit" className="search-btn" disabled={loading}>
                  <Search size={20} />
                  {loading ? 'Searching...' : 'Search Halls'}
                </button>
              </div>

            </div>
          </form>

          {/* Quick Search */}
          <div className="quick-search">
            <p>Popular searches:</p>
            <div className="quick-buttons">
              <button onClick={() => quickSearch('Ariyalur', 300)}>Ariyalur • 300 guests</button>
              <button onClick={() => quickSearch('Chennai', 200)}>Chennai • 200 guests</button>
              <button onClick={() => quickSearch('Coimbatore', 150)}>Coimbatore • 150 guests</button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-section">
        <h2>Popular Event Categories</h2>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <div key={i} className="category-card">
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.count}+ venues</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Locations */}
      <div className="locations-section">
        <h2>📍 Popular Locations</h2>

        <div className="locations-grid">
          {popularLocations.map((loc, index) => (
            <div
              key={index}
              className="location-chip"
              onClick={() =>
                setSearchData(prev => ({
                  ...prev,
                  location: loc.name
                }))
              }
            >
              <MapPin size={16} />
              <span>{loc.name}</span>
              <span className="count">{loc.hallCount}</span>
            </div>
          ))}
        </div>

        {/* SINGLE View All Button */}
        <button
          className="view-all-btn"
          onClick={() => navigate('/locations')}
        >
          📍 View All Locations →
        </button>
      </div>

    </div>
  );
};

export default Home;
