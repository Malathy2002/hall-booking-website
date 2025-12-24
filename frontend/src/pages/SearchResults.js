import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MOCK DATA - Use this if backend fails
  const mockHalls = useMemo(() => [
    {
      id: 1,
      name: "Ariyalur Grand Wedding Palace",
      city: "Ariyalur",
      address: "123 Wedding Street, Ariyalur",
      capacity: 500,
      price: 50000,
      maxGuests: 500,
      rating: 4.5,
      eventTypes: ["wedding", "reception"],
      amenities: ["AC", "Parking", "Catering"],
      images: ["https://picsum.photos/400/300?random=1"]
    },
    {
      id: 2,
      name: "Chennai Celebration Hall",
      city: "Chennai",
      address: "456 Celebration Road, Chennai",
      capacity: 300,
      price: 35000,
      maxGuests: 300,
      rating: 4.3,
      eventTypes: ["wedding", "birthday", "corporate"],
      amenities: ["AC", "Parking", "Sound System"],
      images: ["https://picsum.photos/400/300?random=2"]
    },
    {
      id: 3,
      name: "Ariyalur Party Zone",
      city: "Ariyalur",
      address: "789 Party Road, Ariyalur",
      capacity: 200,
      price: 25000,
      maxGuests: 200,
      rating: 4.2,
      eventTypes: ["birthday", "party"],
      amenities: ["DJ Booth", "Dance Floor"],
      images: ["https://picsum.photos/400/300?random=3"]
    }
  ], []); // Empty dependency array means this only gets created once

  // Function to filter mock data
  const filterMockData = useCallback((locationParam, guestsParam) => {
    let filteredHalls = mockHalls;
    
    if (locationParam) {
      filteredHalls = filteredHalls.filter(hall => 
        hall.city?.toLowerCase().includes(locationParam.toLowerCase()) ||
        hall.name?.toLowerCase().includes(locationParam.toLowerCase())
      );
    }
    
    if (guestsParam) {
      const guestCount = parseInt(guestsParam);
      filteredHalls = filteredHalls.filter(hall => 
        guestCount <= (hall.maxGuests || hall.capacity)
      );
    }
    
    return filteredHalls;
  }, [mockHalls]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchHalls = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Parse search parameters
        const params = new URLSearchParams(location.search);
        const locationParam = params.get('location') || '';
        const guestsParam = params.get('guests') || '';
        
        console.log('Search params:', { location: locationParam, guests: guestsParam });
        
        try {
          // Try to fetch from backend first
          const apiUrl = 'http://localhost:5000/api/halls/search';
          console.log('Fetching from backend:', apiUrl);
          
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Backend response:', data);
          
          if (isMounted) {
            if (data.success && data.data) {
              // Filter based on search params
              let filteredHalls = data.data;
              
              if (locationParam) {
                filteredHalls = filteredHalls.filter(hall => 
                  hall.city?.toLowerCase().includes(locationParam.toLowerCase()) ||
                  hall.name?.toLowerCase().includes(locationParam.toLowerCase())
                );
              }
              
              if (guestsParam) {
                const guestCount = parseInt(guestsParam);
                filteredHalls = filteredHalls.filter(hall => 
                  guestCount <= (hall.maxGuests || hall.capacity)
                );
              }
              
              setHalls(filteredHalls);
            } else {
              // Fallback to mock data
              console.log('Using mock data (backend returned no data)');
              const filteredMockHalls = filterMockData(locationParam, guestsParam);
              setHalls(filteredMockHalls);
            }
          }
        } catch (backendError) {
          console.error('Backend fetch error:', backendError);
          if (isMounted) {
            // Fallback to mock data
            console.log('Using mock data (backend error)');
            const filteredMockHalls = filterMockData(locationParam, guestsParam);
            setHalls(filteredMockHalls);
            setError(`Backend connection failed. Showing mock data. Error: ${backendError.message}`);
          }
        }
        
      } catch (error) {
        console.error('Unexpected error:', error);
        if (isMounted) {
          setError('An unexpected error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchHalls();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [location.search, filterMockData]); // Added filterMockData dependency

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Searching for halls...</h2>
        <p>Looking for the perfect venue for your event</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            fontSize: '1rem',
            cursor: 'pointer',
            padding: '10px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back to Search
        </button>
        
        <h1 style={{ color: '#2d3748', marginTop: '10px' }}>Search Results</h1>
        
        {/* Debug info */}
        <div style={{ 
          background: '#f8fafc', 
          padding: '10px 15px', 
          borderRadius: '8px',
          marginTop: '10px',
          fontSize: '0.9rem',
          color: '#4a5568'
        }}>
          <strong>Debug Info:</strong> Found {halls.length} halls | 
          Backend: {error ? 'Failed - Using mock data' : 'Connected'}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          background: '#fed7d7',
          border: '1px solid #fc8181',
          color: '#c53030',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {halls.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ color: '#2d3748', marginBottom: '15px' }}>No halls found</h2>
          <p style={{ color: '#4a5568', marginBottom: '20px' }}>
            Try adjusting your search criteria or try these popular searches:
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/search?location=Ariyalur&guests=300')}
              style={{
                padding: '10px 20px',
                background: '#edf2f7',
                border: '1px solid #cbd5e0',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              Ariyalur • 300 guests
            </button>
            <button 
              onClick={() => navigate('/search?location=Chennai&guests=200')}
              style={{
                padding: '10px 20px',
                background: '#edf2f7',
                border: '1px solid #cbd5e0',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              Chennai • 200 guests
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '25px' }}>
          {halls.map(hall => (
            <div 
              key={hall.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                display: 'flex',
                gap: '20px',
                padding: '20px'
              }}
            >
              <img 
                src={hall.images?.[0] || 'https://picsum.photos/300/200'} 
                alt={hall.name}
                style={{
                  width: '300px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>{hall.name}</h3>
                  <span style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontWeight: '600'
                  }}>
                    ₹{hall.price.toLocaleString()}
                  </span>
                </div>
                
                <p style={{ color: '#718096', margin: '0 0 15px 0' }}>
                  📍 {hall.city} • 👥 {hall.maxGuests || hall.capacity} guests • ⭐ {hall.rating}/5
                </p>
                
                <div style={{ marginBottom: '15px' }}>
                  {hall.eventTypes?.slice(0, 3).map((type, index) => (
                    <span 
                      key={index}
                      style={{
                        background: '#edf2f7',
                        color: '#4a5568',
                        padding: '4px 10px',
                        borderRadius: '15px',
                        fontSize: '0.85rem',
                        marginRight: '8px',
                        border: '1px solid #cbd5e0'
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => navigate(`/hall/${hall.id}`)}
                  style={{
                    padding: '10px 20px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Debug buttons */}
      <div style={{ 
        marginTop: '50px', 
        paddingTop: '20px', 
        borderTop: '2px dashed #e2e8f0',
        textAlign: 'center'
      }}>
        <p style={{ color: '#718096', marginBottom: '15px' }}>Troubleshooting:</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => window.open('http://localhost:5000/api/halls/search', '_blank')}
            style={{
              padding: '8px 16px',
              background: '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Backend API
          </button>
          <button 
            onClick={() => console.log('Halls data:', halls)}
            style={{
              padding: '8px 16px',
              background: '#ed8936',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Console Log Data
          </button>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            New Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;