import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, PartyPopper, Shield, CreditCard, Headphones, Star, ChevronRight } from 'lucide-react';
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
    'Salem', 'Erode', 'Vellore', 'Thanjavur', 'Tirunelveli',
    'Kanyakumari', 'Dindigul', 'Karur', 'Namakkal', 'Dharmapuri',
    'Krishnagiri', 'Tiruppur', 'Nagapattinam', 'Cuddalore'
  ];

  // Event types
  const eventTypes = [
    { id: 'wedding', name: 'Wedding', icon: '💒' },
    { id: 'birthday', name: 'Birthday', icon: '🎂' },
    { id: 'corporate', name: 'Corporate', icon: '💼' },
    { id: 'reception', name: 'Reception', icon: '🎉' },
    { id: 'engagement', name: 'Engagement', icon: '💍' },
    { id: 'anniversary', name: 'Anniversary', icon: '🥂' },
    { id: 'conference', name: 'Conference', icon: '🎤' },
    { id: 'seminar', name: 'Seminar', icon: '📚' }
  ];

  // Categories - CLICKABLE
  const categories = [
    { 
      name: 'Wedding Venues', 
      count: 45, 
      icon: '💒', 
      desc: 'Perfect for grand weddings',
      eventType: 'wedding',
      guests: 200
    },
    { 
      name: 'Birthday Halls', 
      count: 32, 
      icon: '🎂', 
      desc: 'Celebrate in style',
      eventType: 'birthday',
      guests: 100
    },
    { 
      name: 'Corporate Events', 
      count: 28, 
      icon: '💼', 
      desc: 'Professional venues',
      eventType: 'corporate',
      guests: 150
    },
    { 
      name: 'Party Places', 
      count: 36, 
      icon: '🎉', 
      desc: 'Fun and vibrant',
      eventType: 'party',
      guests: 120
    },
    { 
      name: 'Reception Halls', 
      count: 25, 
      icon: '🥂', 
      desc: 'Elegant celebrations',
      eventType: 'reception',
      guests: 250
    },
    { 
      name: 'Conference Centers', 
      count: 18, 
      icon: '🎤', 
      desc: 'Business meetings',
      eventType: 'conference',
      guests: 100
    }
  ];

  // Popular Locations
  const popularLocations = [
    { name: 'Ariyalur', hallCount: 12, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&auto=format&fit=crop' },
    { name: 'Chennai', hallCount: 25, image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&auto=format&fit=crop' },
    { name: 'Coimbatore', hallCount: 18, image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&auto=format&fit=crop' },
    { name: 'Madurai', hallCount: 15, image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop' },
    { name: 'Trichy', hallCount: 10, image: 'https://images.unsplash.com/photo-1519677100203-9ffc4e1e9bdb?w=400&auto=format&fit=crop' },
    { name: 'Salem', hallCount: 8, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop' }
  ];

  // Popular searches
  const popularSearches = [
    { location: 'Ariyalur', guests: '500', eventType: 'wedding' },
    { location: 'Chennai', guests: '200', eventType: 'corporate' },
    { location: 'Coimbatore', guests: '150', eventType: 'reception' },
    { location: 'Madurai', guests: '300', eventType: 'traditional' },
    { location: 'Trichy', guests: '250', eventType: 'wedding' },
    { location: 'Salem', guests: '180', eventType: 'birthday' }
  ];

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    // Build query parameters
    const params = new URLSearchParams();
    
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.guests) params.append('guests', searchData.guests);
    if (searchData.eventType) params.append('eventType', searchData.eventType);
    if (searchData.eventDate) params.append('date', searchData.eventDate);

    navigate(`/search?${params.toString()}`);
    
    setTimeout(() => setLoading(false), 500);
  };

  // Handle category click - Navigates to search page with category filters
  const handleCategoryClick = (category) => {
    const params = new URLSearchParams();
    params.append('eventType', category.eventType);
    params.append('guests', category.guests);
    
    navigate(`/search?${params.toString()}`);
  };

  // Handle popular search click
  const handlePopularSearch = (search) => {
    setSearchData({
      location: search.location,
      guests: search.guests,
      eventDate: '',
      eventType: search.eventType
    });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Find Your Perfect Function Hall</h1>
            <p className="hero-subtitle">
              Book beautiful venues for weddings, birthdays, corporate events and more
            </p>

            <form className="search-form" onSubmit={handleSearch}>
              <div className="form-grid">
                <div className="form-group">
                  <label><MapPin size={18} /> Location</label>
                  <select
                    name="location"
                    value={searchData.location}
                    onChange={handleInputChange}
                    className="form-input"
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
                    min={new Date().toISOString().split('T')[0]}
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
                    placeholder="Number of guests"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label><PartyPopper size={18} /> Event Type</label>
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

            {/* Popular searches */}
            <div className="popular-searches">
              <p className="popular-title">Popular searches:</p>
              <div className="search-tags">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    className="search-tag"
                    onClick={() => handlePopularSearch(search)}
                  >
                    {search.location} • {search.guests} guests • {search.eventType}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section - NOW CLICKABLE */}
      <div className="categories-section">
        <div className="container">
          <h2>Popular Event Categories</h2>
          <p className="section-subtitle">Find the perfect venue for your special occasion</p>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                className="category-card"
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p className="count">{cat.count}+ venues</p>
                <p className="desc">{cat.desc}</p>
                <div className="category-footer">
                  <span className="click-hint">
                    Browse Venues 
                    <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Locations Section */}
      <div className="locations-section">
        <div className="container">
          <h2>📍 Popular Locations</h2>
          <p className="section-subtitle">Explore venues in these popular cities</p>
          <div className="locations-grid">
            {popularLocations.map((loc, index) => (
              <div
                key={index}
                className="location-card"
                onClick={() => setSearchData(prev => ({
                  ...prev,
                  location: loc.name
                }))}
              >
                <div className="location-image">
                  <img src={loc.image} alt={loc.name} />
                  <div className="location-overlay">
                    <MapPin size={20} />
                    <span>{loc.name}</span>
                  </div>
                </div>
                <div className="location-info">
                  <h3>{loc.name}</h3>
                  <p>{loc.hallCount} venues available</p>
                  <button 
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/search?location=${loc.name}`);
                    }}
                  >
                    View Halls
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Verified Venues</h3>
              <p>All halls are personally verified for quality and amenities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <CreditCard size={32} />
              </div>
              <h3>Secure Booking</h3>
              <p>Book with confidence using our secure payment system</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Headphones size={32} />
              </div>
              <h3>24/7 Support</h3>
              <p>Our support team is always ready to help you</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Star size={32} />
              </div>
              <h3>Best Prices</h3>
              <p>Get the best deals with our price match guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="container">
          <h2>Ready to Book Your Perfect Venue?</h2>
          <p>Start your search now and find the ideal hall for your event</p>
          <button 
            className="cta-btn"
            onClick={() => navigate('/search')}
          >
            Browse All Halls
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;