import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Users, Star, Phone, Check, 
  ArrowLeft, Clock, Image as ImageIcon, Share2, Heart
} from 'lucide-react';
import './HallDetails.css';

const HallDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(100);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'wedding',
    specialRequests: ''
  });

  // Move defaultImages inside useMemo to make it stable
  const defaultImages = useMemo(() => [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop'
  ], []);

  // Create getMockHall with useCallback
  const getMockHall = useCallback((hallId) => {
    const mockHalls = {
      '1': {
        id: 1,
        name: "Ariyalur Grand Wedding Palace",
        city: "Ariyalur",
        address: "123 Wedding Street, Ariyalur, Tamil Nadu - 621704",
        capacity: 500,
        price: 50000,
        maxGuests: 500,
        minGuests: 100,
        description: "A beautiful wedding palace with excellent facilities for all types of events. Perfect for grand weddings and receptions. Spacious 5000 sq.ft area with modern amenities.",
        eventTypes: ["wedding", "reception", "engagement", "anniversary"],
        amenities: ["AC", "Parking", "Catering", "Stage", "Lighting", "Sound System", "Decoration", "WiFi"],
        rating: 4.5,
        totalReviews: 120,
        contact: "+91 98765 43210",
        owner: "John Doe",
        images: defaultImages,
        features: [
          "5000 sq.ft carpet area",
          "Separate parking for 100+ cars",
          "Full AC with central cooling",
          "In-house catering available",
          "Professional sound system",
          "Stage with LED lighting",
          "Separate bride & groom rooms",
          "Power backup generator"
        ],
        rules: [
          "No smoking inside the hall",
          "No outside food allowed",
          "Music must stop by 11 PM",
          "Advance booking required",
          "Security deposit of ₹10,000",
          "Decorations allowed with prior permission"
        ]
      },
      '2': {
        id: 2,
        name: "Chennai Celebration Hall",
        city: "Chennai",
        address: "456 Celebration Road, T Nagar, Chennai - 600017",
        capacity: 300,
        price: 35000,
        maxGuests: 300,
        minGuests: 50,
        description: "Modern hall perfect for corporate events, birthdays, and small weddings. Located in the heart of Chennai with excellent connectivity.",
        eventTypes: ["wedding", "birthday", "corporate", "conference", "seminar"],
        amenities: ["AC", "Parking", "Sound System", "Projector", "WiFi", "Catering", "Whiteboard"],
        rating: 4.3,
        totalReviews: 85,
        contact: "+91 98765 43211",
        owner: "Jane Smith",
        images: [
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1492684223066-dd23140edf6d?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop'
        ],
        features: [
          "3000 sq.ft area",
          "Parking for 50 cars",
          "Projector and screen",
          "High-speed WiFi",
          "Conference facilities",
          "Catering kitchen",
          "Separate entrance"
        ]
      }
    };
    
    return mockHalls[hallId] || mockHalls['1'];
  }, [defaultImages]); // defaultImages is now stable thanks to useMemo

  // Load hall data
  useEffect(() => {
    // Use mock data immediately (skip API call)
    const mockHall = getMockHall(id);
    setHall(mockHall);
    setLoading(false);
    
    console.log('Loaded hall:', mockHall.name);
  }, [id, getMockHall]);

  // Calculate total price
  const calculateTotal = () => {
    if (!hall) return 0;
    const tax = hall.price * 0.18;
    return hall.price + tax;
  };

  const handleBookingStep1 = () => {
    if (!selectedDate) {
      alert('Please select an event date');
      return;
    }
    setBookingStep(2);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!bookingData.name || !bookingData.email || !bookingData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Show loading
      const loadingDiv = document.createElement('div');
      loadingDiv.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        ">
          <div style="
            background: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
          ">
            <h3>Processing Booking...</h3>
            <div class="spinner" style="
              border: 4px solid #f3f3f3;
              border-top: 4px solid #667eea;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            "></div>
            <p>Please wait while we confirm your booking</p>
          </div>
        </div>
      `;
      document.body.appendChild(loadingDiv);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Remove loading
      document.body.removeChild(loadingDiv);

      // Show success modal
      const today = new Date();
      const bookingId = `BK${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      const modalHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        ">
          <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          ">
            <div style="
              width: 80px;
              height: 80px;
              background: #48bb78;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
            ">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            
            <h2 style="color: #2d3748; margin-bottom: 10px;">Booking Confirmed! 🎉</h2>
            <p style="color: #718096; margin-bottom: 20px;">Your booking has been successfully placed</p>
            
            <div style="
              background: #f8fafc;
              padding: 20px;
              border-radius: 10px;
              text-align: left;
              margin: 20px 0;
            ">
              <p><strong>Booking ID:</strong> ${bookingId}</p>
              <p><strong>Hall:</strong> ${hall.name}</p>
              <p><strong>Date:</strong> ${new Date(selectedDate).toLocaleDateString('en-IN')}</p>
              <p><strong>Guests:</strong> ${guests}</p>
              <p><strong>Amount:</strong> ₹${calculateTotal().toLocaleString('en-IN')}</p>
            </div>
            
            <p style="color: #4a5568; font-size: 0.9rem; margin: 20px 0;">
              A confirmation email has been sent to ${bookingData.email}
            </p>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
              <button onclick="this.parentElement.parentElement.parentElement.remove(); window.location.href='/'" style="
                padding: 12px 24px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
              ">
                Back to Home
              </button>
              <button onclick="this.parentElement.parentElement.parentElement.remove(); window.print()" style="
                padding: 12px 24px;
                background: #edf2f7;
                color: #4a5568;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
              ">
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      `;
      
      const modalDiv = document.createElement('div');
      modalDiv.innerHTML = modalHTML;
      document.body.appendChild(modalDiv);

      // Reset form
      setBookingStep(1);
      setSelectedDate('');
      setGuests(100);
      setBookingData({
        name: '',
        email: '',
        phone: '',
        eventType: 'wedding',
        specialRequests: ''
      });

    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading hall details...</h2>
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="not-found-container">
        <h2>Hall not found</h2>
        <p>The hall you're looking for doesn't exist or has been removed.</p>
        <button 
          className="browse-btn"
          onClick={() => navigate('/search')}
        >
          Browse Halls
        </button>
      </div>
    );
  }

  const totalAmount = calculateTotal();
  const taxAmount = hall.price * 0.18;

  return (
    <div className="hall-details-container">
      {/* Back Button */}
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
        Back to Search
      </button>

      {/* Main Content */}
      <div className="hall-main">
        {/* Hall Images Gallery */}
        <div className="hall-images-section">
          <div className="main-image-container">
            <img 
              src={hall.images[activeImageIndex]} 
              alt={hall.name}
              className="main-image"
            />
            <div className="image-actions">
              <button className="image-action-btn">
                <Heart size={20} />
              </button>
              <button className="image-action-btn">
                <Share2 size={20} />
              </button>
            </div>
          </div>
          
          <div className="thumbnail-gallery">
            {hall.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${hall.name} ${index + 1}`}
                className={`thumbnail ${activeImageIndex === index ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
          
          <div className="image-count">
            <ImageIcon size={16} />
            <span>{hall.images.length} photos available</span>
          </div>
        </div>

        {/* Hall Info */}
        <div className="hall-info">
          <div className="hall-header">
            <div>
              <h1>{hall.name}</h1>
              <div className="hall-location">
                <MapPin size={18} />
                <span>{hall.address}</span>
              </div>
            </div>
            <div className="hall-rating">
              <Star size={20} fill="#FFD700" color="#FFD700" />
              <span className="rating-number">{hall.rating}</span>
              <span className="rating-text">({hall.totalReviews || 120} reviews)</span>
            </div>
          </div>

          <div className="hall-description">
            <h3>About this venue</h3>
            <p>{hall.description}</p>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat">
              <Users size={24} />
              <div>
                <span className="stat-value">Up to {hall.maxGuests}</span>
                <span className="stat-label">Guests Capacity</span>
              </div>
            </div>
            <div className="stat">
              <Phone size={24} />
              <div>
                <span className="stat-value">{hall.contact}</span>
                <span className="stat-label">Contact Number</span>
              </div>
            </div>
          </div>

          {/* Features */}
          {hall.features && (
            <div className="section">
              <h3>Key Features</h3>
              <div className="features-grid">
                {hall.features.map((feature, index) => (
                  <div key={index} className="feature">
                    <Check size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="section">
            <h3>Amenities & Facilities</h3>
            <div className="amenities-grid">
              {hall.amenities.map((amenity, index) => (
                <div key={index} className="amenity">
                  <Check size={16} />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Types */}
          <div className="section">
            <h3>Suitable For</h3>
            <div className="event-types">
              {hall.eventTypes.map((type, index) => (
                <span key={index} className="event-tag">
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Rules */}
          {hall.rules && (
            <div className="section rules-section">
              <h3>Rules & Policies</h3>
              <ul className="rules-list">
                {hall.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="booking-sidebar">
          <div className="booking-card">
            <h3>Book This Hall</h3>
            
            {bookingStep === 1 ? (
              <>
                <div className="price-display">
                  <span className="price-amount">₹{hall.price.toLocaleString('en-IN')}</span>
                  <span className="price-label">per event</span>
                </div>

                <div className="booking-form-step1">
                  <div className="form-group">
                    <label>Event Date *</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="date-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Number of Guests</label>
                    <div className="guests-slider">
                      <input
                        type="range"
                        min={hall.minGuests || 50}
                        max={hall.maxGuests}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="slider"
                      />
                      <div className="guests-display">
                        <span>{guests} guests</span>
                        <span>(Min: {hall.minGuests || 50} - Max: {hall.maxGuests})</span>
                      </div>
                    </div>
                  </div>

                  <div className="price-summary">
                    <div className="summary-item">
                      <span>Hall Price</span>
                      <span>₹{hall.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="summary-item">
                      <span>Tax (18%)</span>
                      <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="summary-item total">
                      <span>Total Amount</span>
                      <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button 
                    className="proceed-btn"
                    onClick={handleBookingStep1}
                    disabled={!selectedDate}
                  >
                    Proceed to Booking
                  </button>

                  <div className="booking-note">
                    <Clock size={16} />
                    <span>Free cancellation within 48 hours of booking</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="booking-form-step2">
                <h4>Your Details</h4>
                <form onSubmit={handleBookingSubmit}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Event Type</label>
                    <select
                      name="eventType"
                      value={bookingData.eventType}
                      onChange={handleInputChange}
                    >
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="reception">Reception</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Special Requests (Optional)</label>
                    <textarea
                      name="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or requests..."
                      rows="3"
                    />
                  </div>

                  <div className="booking-summary">
                    <h5>Booking Summary</h5>
                    <p><strong>Hall:</strong> {hall.name}</p>
                    <p><strong>Date:</strong> {selectedDate}</p>
                    <p><strong>Guests:</strong> {guests}</p>
                    <p><strong>Total:</strong> ₹{totalAmount.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="form-buttons">
                    <button
                      type="button"
                      className="back-btn"
                      onClick={() => setBookingStep(1)}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="confirm-btn"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="hall-footer">
        <p>© 2025 - 2027 Hall Booking System. All rights reserved.</p>
        <p>Need help? Call {hall.contact} or email support@hallbooking.com</p>
      </footer>
    </div>
  );
};

export default HallDetails;