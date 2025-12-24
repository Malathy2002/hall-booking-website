const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Comprehensive halls data with multiple locations
const mockHalls = [
  {
    id: 1,
    name: "Ariyalur Grand Wedding Palace",
    city: "Ariyalur",
    address: "123 Wedding Street, Ariyalur",
    capacity: 500,
    price: 50000,
    maxGuests: 500,
    minGuests: 100,
    rating: 4.5,
    totalReviews: 120,
    contact: "9876543210",
    owner: "John Doe",
    eventTypes: ["wedding", "reception", "engagement"],
    amenities: ["AC", "Parking", "Catering", "Stage", "Lighting", "Sound System", "Decoration"],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop"
    ],
    rules: ["No smoking", "No outside food", "Music until 11 PM"],
    features: ["5000 sq.ft", "100 car parking", "Full AC"],
    description: "A beautiful wedding palace with excellent facilities for all types of events.",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Chennai Celebration Hall",
    city: "Chennai",
    address: "456 Celebration Road, Chennai",
    capacity: 300,
    price: 35000,
    maxGuests: 300,
    minGuests: 50,
    rating: 4.3,
    totalReviews: 85,
    contact: "9876543211",
    owner: "Jane Smith",
    eventTypes: ["wedding", "birthday", "corporate", "conference"],
    amenities: ["AC", "Parking", "Sound System", "Projector", "WiFi", "Catering"],
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&auto=format&fit=crop"
    ],
    rules: ["Corporate events on weekdays", "Decoration allowed"],
    features: ["3000 sq.ft", "Modern lighting", "High-speed WiFi"],
    description: "Modern hall perfect for corporate events and celebrations in Chennai.",
    createdAt: "2024-02-10"
  },
  {
    id: 3,
    name: "Coimbatore Royal Banquet",
    city: "Coimbatore",
    address: "101 Royal Street, Coimbatore",
    capacity: 400,
    price: 45000,
    maxGuests: 400,
    minGuests: 80,
    rating: 4.7,
    totalReviews: 150,
    contact: "9876543213",
    owner: "Rajesh Kumar",
    eventTypes: ["wedding", "reception", "banquet"],
    amenities: ["AC", "Valet Parking", "Premium Catering", "Royal Decor"],
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop"
    ],
    rules: ["Premium events only", "Booking 3 months advance"],
    features: ["Royal-themed decor", "Valet parking", "Gold-plated cutlery"],
    description: "Luxurious banquet hall for royal weddings in Coimbatore.",
    createdAt: "2024-01-20"
  },
  {
    id: 4,
    name: "Madurai Traditional Hall",
    city: "Madurai",
    address: "202 Temple Road, Madurai",
    capacity: 350,
    price: 30000,
    maxGuests: 350,
    minGuests: 60,
    rating: 4.4,
    totalReviews: 95,
    contact: "9876543214",
    owner: "Sundar Rajan",
    eventTypes: ["wedding", "traditional", "family"],
    amenities: ["AC", "Parking", "Traditional Catering", "Stage"],
    images: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop"
    ],
    rules: ["Traditional attire", "Vegetarian food only"],
    features: ["Traditional kolam", "Temple-style architecture"],
    description: "Traditional South Indian style wedding hall in Madurai.",
    createdAt: "2024-02-15"
  },
  {
    id: 5,
    name: "Trichy Marriage Mahal",
    city: "Trichy",
    address: "303 River View Road, Trichy",
    capacity: 450,
    price: 42000,
    maxGuests: 450,
    minGuests: 75,
    rating: 4.6,
    totalReviews: 110,
    contact: "9876543215",
    owner: "Arun Kumar",
    eventTypes: ["wedding", "reception", "engagement"],
    amenities: ["AC", "Parking", "Catering", "River View", "Garden"],
    images: [
      "https://images.unsplash.com/photo-1519677100203-9ffc4e1e9bdb?w=800&auto=format&fit=crop"
    ],
    rules: ["River view access", "Garden ceremony possible"],
    features: ["River view", "Beautiful garden", "Spacious lawn"],
    description: "Beautiful marriage hall with river view in Trichy.",
    createdAt: "2024-01-25"
  },
  {
    id: 6,
    name: "Salem City Convention Center",
    city: "Salem",
    address: "404 Convention Street, Salem",
    capacity: 600,
    price: 55000,
    maxGuests: 600,
    minGuests: 100,
    rating: 4.5,
    totalReviews: 130,
    contact: "9876543216",
    owner: "Vijay Kumar",
    eventTypes: ["corporate", "conference", "exhibition", "wedding"],
    amenities: ["AC", "Large Parking", "Projector", "Stage", "Exhibition Space"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop"
    ],
    rules: ["Corporate preferred", "Flexible timings"],
    features: ["Large exhibition space", "Modern facilities", "Central location"],
    description: "Large convention center suitable for corporate events and exhibitions.",
    createdAt: "2024-02-05"
  },
  {
    id: 7,
    name: "Erode Celebration Gardens",
    city: "Erode",
    address: "505 Garden Road, Erode",
    capacity: 250,
    price: 28000,
    maxGuests: 250,
    minGuests: 40,
    rating: 4.2,
    totalReviews: 70,
    contact: "9876543217",
    owner: "Mohan Raj",
    eventTypes: ["birthday", "anniversary", "get-together", "small wedding"],
    amenities: ["Garden", "Outdoor Seating", "Catering", "Music System"],
    images: [
      "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&auto=format&fit=crop"
    ],
    rules: ["Outdoor events", "Weather dependent"],
    features: ["Beautiful garden", "Outdoor seating", "Natural ambiance"],
    description: "Beautiful garden venue for intimate celebrations in Erode.",
    createdAt: "2024-02-20"
  },
  {
    id: 8,
    name: "Karur Diamond Palace",
    city: "Karur",
    address: "606 Diamond Street, Karur",
    capacity: 320,
    price: 32000,
    maxGuests: 320,
    minGuests: 60,
    rating: 4.3,
    totalReviews: 80,
    contact: "9876543218",
    owner: "Siva Kumar",
    eventTypes: ["wedding", "reception", "engagement"],
    amenities: ["AC", "Parking", "Catering", "Elegant Decor"],
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop"
    ],
    rules: ["Elegant decor provided", "Professional photographers"],
    features: ["Diamond-themed decor", "Elegant interiors", "Professional lighting"],
    description: "Elegant wedding palace with diamond-themed decorations in Karur.",
    createdAt: "2024-01-30"
  },
  {
    id: 9,
    name: "Dharmapuri Green Meadows",
    city: "Dharmapuri",
    address: "707 Meadow Road, Dharmapuri",
    capacity: 200,
    price: 22000,
    maxGuests: 200,
    minGuests: 30,
    rating: 4.1,
    totalReviews: 65,
    contact: "9876543219",
    owner: "Ramesh Babu",
    eventTypes: ["birthday", "party", "family function", "small wedding"],
    amenities: ["Garden", "Outdoor", "Barbecue", "Play Area"],
    images: [
      "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=800&auto=format&fit=crop"
    ],
    rules: ["Family-friendly", "Play area for kids"],
    features: ["Green meadows", "Barbecue facilities", "Children's play area"],
    description: "Green meadow venue perfect for family functions and small gatherings.",
    createdAt: "2024-03-01"
  },
  {
    id: 10,
    name: "Krishnagiri Hill View Palace",
    city: "Krishnagiri",
    address: "808 Hill View Road, Krishnagiri",
    capacity: 280,
    price: 30000,
    maxGuests: 280,
    minGuests: 50,
    rating: 4.4,
    totalReviews: 75,
    contact: "9876543220",
    owner: "Kumar Raja",
    eventTypes: ["wedding", "reception", "anniversary", "photoshoot"],
    amenities: ["Hill View", "AC", "Parking", "Photography Spots"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop"
    ],
    rules: ["Hill view photography", "Nature-friendly"],
    features: ["Panoramic hill views", "Beautiful photography spots", "Natural lighting"],
    description: "Hill view palace offering breathtaking views for weddings and events.",
    createdAt: "2024-02-28"
  },
  {
    id: 11,
    name: "Thanjavur Royal Heritage Hall",
    city: "Thanjavur",
    address: "909 Heritage Street, Thanjavur",
    capacity: 350,
    price: 40000,
    maxGuests: 350,
    minGuests: 70,
    rating: 4.8,
    totalReviews: 140,
    contact: "9876543221",
    owner: "Rajendra Cholan",
    eventTypes: ["traditional wedding", "cultural", "heritage", "music concert"],
    amenities: ["Heritage Decor", "AC", "Traditional Stage", "Cultural Facilities"],
    images: [
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop"
    ],
    rules: ["Cultural events preferred", "Traditional attire"],
    features: ["Heritage architecture", "Traditional art", "Cultural ambiance"],
    description: "Heritage hall reflecting Thanjavur's rich cultural history.",
    createdAt: "2024-01-10"
  },
  {
    id: 12,
    name: "Nagapattinam Beachside Venue",
    city: "Nagapattinam",
    address: "101 Beach Road, Nagapattinam",
    capacity: 180,
    price: 25000,
    maxGuests: 180,
    minGuests: 25,
    rating: 4.2,
    totalReviews: 60,
    contact: "9876543222",
    owner: "Fisherman Raj",
    eventTypes: ["beach wedding", "party", "anniversary", "destination"],
    amenities: ["Beach Access", "Open Air", "Sea View", "Catering"],
    images: [
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop"
    ],
    rules: ["Beach access", "Tide schedule", "Eco-friendly"],
    features: ["Beachfront location", "Sea breeze", "Sunset views"],
    description: "Beautiful beachside venue for destination weddings and parties.",
    createdAt: "2024-03-05"
  },
  {
    id: 13,
    name: "Tiruppur Textile Convention Hall",
    city: "Tiruppur",
    address: "202 Textile Street, Tiruppur",
    capacity: 400,
    price: 38000,
    maxGuests: 400,
    minGuests: 80,
    rating: 4.3,
    totalReviews: 90,
    contact: "9876543223",
    owner: "Textile King",
    eventTypes: ["corporate", "exhibition", "trade show", "conference"],
    amenities: ["Exhibition Space", "AC", "Parking", "Business Facilities"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop"
    ],
    rules: ["Business events", "Trade exhibitions"],
    features: ["Large exhibition area", "Business amenities", "Industrial decor"],
    description: "Specialized convention hall for textile industry events and exhibitions.",
    createdAt: "2024-02-12"
  },
  {
    id: 14,
    name: "Vellore Fort View Palace",
    city: "Vellore",
    address: "303 Fort View Road, Vellore",
    capacity: 300,
    price: 35000,
    maxGuests: 300,
    minGuests: 50,
    rating: 4.5,
    totalReviews: 95,
    contact: "9876543224",
    owner: "Fort Heritage",
    eventTypes: ["wedding", "heritage", "cultural", "photoshoot"],
    amenities: ["Fort View", "AC", "Heritage Decor", "Gardens"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop"
    ],
    rules: ["Heritage preservation", "Cultural sensitivity"],
    features: ["Fort views", "Heritage gardens", "Historical ambiance"],
    description: "Palace with views of Vellore Fort, perfect for heritage weddings.",
    createdAt: "2024-02-25"
  },
  {
    id: 15,
    name: "Cuddalore Ocean Pearl Hall",
    city: "Cuddalore",
    address: "404 Coastal Road, Cuddalore",
    capacity: 220,
    price: 27000,
    maxGuests: 220,
    minGuests: 40,
    rating: 4.1,
    totalReviews: 55,
    contact: "9876543225",
    owner: "Coastal Events",
    eventTypes: ["wedding", "reception", "beach party", "anniversary"],
    amenities: ["Coastal View", "AC", "Parking", "Outdoor Space"],
    images: [
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop"
    ],
    rules: ["Coastal regulations", "Weather consideration"],
    features: ["Ocean views", "Sea breeze", "Coastal decor"],
    description: "Beautiful hall with ocean views in Cuddalore.",
    createdAt: "2024-03-10"
  }
];

// Home route with documentation
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hall Booking System API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          background: #f5f5f5;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 30px 0;
        }
        .stat-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #3498db;
        }
        .stat-label {
          color: #666;
          margin-top: 5px;
        }
        .endpoint {
          background: #f8f9fa;
          padding: 15px;
          border-left: 4px solid #3498db;
          margin: 10px 0;
          border-radius: 4px;
        }
        .method {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
          margin-right: 10px;
        }
        .GET { background: #d4edda; color: #155724; }
        .POST { background: #d1ecf1; color: #0c5460; }
        .PUT { background: #fff3cd; color: #856404; }
        .DELETE { background: #f8d7da; color: #721c24; }
        .locations {
          margin: 30px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .city-tag {
          display: inline-block;
          background: #3498db;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          margin: 5px;
          font-size: 14px;
        }
        a {
          color: #3498db;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏨 Hall Booking System API</h1>
        <p>Backend server providing hall booking services across multiple locations in Tamil Nadu.</p>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${mockHalls.length}</div>
            <div class="stat-label">Total Halls</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">15</div>
            <div class="stat-label">Cities Covered</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${new Date().toLocaleTimeString()}</div>
            <div class="stat-label">Current Time</div>
          </div>
        </div>
        
        <div class="locations">
          <h3>📌 Available Cities:</h3>
          ${Array.from(new Set(mockHalls.map(h => h.city))).map(city => 
            `<span class="city-tag">${city}</span>`
          ).join('')}
        </div>
        
        <h3>📡 API Endpoints:</h3>
        
        <div class="endpoint">
          <span class="method GET">GET</span>
          <strong>/api/test</strong><br>
          Test API connection<br>
          <a href="/api/test">Try it →</a>
        </div>
        
        <div class="endpoint">
          <span class="method GET">GET</span>
          <strong>/api/halls</strong><br>
          Get all halls<br>
          <a href="/api/halls">Try it →</a>
        </div>
        
        <div class="endpoint">
          <span class="method GET">GET</span>
          <strong>/api/halls/search</strong><br>
          Search halls by location, guests, event type<br>
          <a href="/api/halls/search?location=Chennai&guests=200">Example: Chennai halls for 200 guests</a><br>
          <small>Params: location, guests, eventType, minPrice, maxPrice</small>
        </div>
        
        <div class="endpoint">
          <span class="method GET">GET</span>
          <strong>/api/halls/:id</strong><br>
          Get hall details by ID<br>
          <a href="/api/halls/1">Example: Hall with ID 1</a>
        </div>
        
        <div class="endpoint">
          <span class="method GET">GET</span>
          <strong>/api/halls/city/:city</strong><br>
          Get halls by city name<br>
          <a href="/api/halls/city/Chennai">Example: Halls in Chennai</a>
        </div>
        
        <h3>🔍 Search Examples:</h3>
        <ul>
          <li><a href="/api/halls/search?location=Ariyalur">Halls in Ariyalur</a></li>
          <li><a href="/api/halls/search?location=Chennai&guests=250">Chennai halls for 250 guests</a></li>
          <li><a href="/api/halls/search?eventType=wedding">Wedding halls</a></li>
          <li><a href="/api/halls/search?minPrice=20000&maxPrice=40000">Halls between ₹20k-₹40k</a></li>
          <li><a href="/api/halls/search?location=Madurai&eventType=traditional">Traditional halls in Madurai</a></li>
        </ul>
        
        <h3>🚀 Quick Start:</h3>
        <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
// JavaScript fetch example
fetch('/api/halls/search?location=Coimbatore&guests=300')
  .then(response => response.json())
  .then(data => console.log(data));</pre>
        
        <p><strong>Server Status:</strong> ✅ Running on port ${PORT}</p>
        <p><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `);
});

// Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    totalHalls: mockHalls.length,
    totalCities: Array.from(new Set(mockHalls.map(h => h.city))).length
  });
});

// Get all halls
app.get('/api/halls', (req, res) => {
  res.json({
    success: true,
    data: mockHalls,
    count: mockHalls.length,
    totalCities: Array.from(new Set(mockHalls.map(h => h.city))).length
  });
});

// Search halls with advanced filters
app.get('/api/halls/search', (req, res) => {
  const { location, guests, eventType, minPrice, maxPrice, amenities } = req.query;
  let filteredHalls = [...mockHalls];
  
  // Filter by location
  if (location) {
    filteredHalls = filteredHalls.filter(hall => 
      hall.city.toLowerCase().includes(location.toLowerCase()) ||
      hall.name.toLowerCase().includes(location.toLowerCase()) ||
      hall.address.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  // Filter by guests
  if (guests) {
    const guestCount = parseInt(guests);
    if (!isNaN(guestCount)) {
      filteredHalls = filteredHalls.filter(hall => 
        guestCount <= hall.maxGuests && guestCount >= (hall.minGuests || 0)
      );
    }
  }
  
  // Filter by event type
  if (eventType) {
    filteredHalls = filteredHalls.filter(hall => 
      hall.eventTypes && 
      hall.eventTypes.some(type => 
        type.toLowerCase().includes(eventType.toLowerCase())
      )
    );
  }
  
  // Filter by price range
  if (minPrice) {
    const min = parseInt(minPrice);
    if (!isNaN(min)) {
      filteredHalls = filteredHalls.filter(hall => hall.price >= min);
    }
  }
  
  if (maxPrice) {
    const max = parseInt(maxPrice);
    if (!isNaN(max)) {
      filteredHalls = filteredHalls.filter(hall => hall.price <= max);
    }
  }
  
  // Filter by amenities
  if (amenities) {
    const amenityList = amenities.split(',').map(a => a.trim().toLowerCase());
    filteredHalls = filteredHalls.filter(hall => 
      hall.amenities && 
      amenityList.every(amenity => 
        hall.amenities.some(a => a.toLowerCase().includes(amenity))
      )
    );
  }
  
  // Sort by rating (highest first)
  filteredHalls.sort((a, b) => b.rating - a.rating);
  
  res.json({
    success: true,
    data: filteredHalls,
    count: filteredHalls.length,
    filters: { location, guests, eventType, minPrice, maxPrice, amenities }
  });
});

// Get hall by ID
app.get('/api/halls/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const hall = mockHalls.find(h => h.id === id);
  
  if (hall) {
    res.json({ 
      success: true, 
      data: hall,
      similarHalls: mockHalls
        .filter(h => h.city === hall.city && h.id !== hall.id)
        .slice(0, 3)
    });
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'Hall not found',
      availableIds: mockHalls.map(h => h.id)
    });
  }
});

// Get halls by city
app.get('/api/halls/city/:city', (req, res) => {
  const city = req.params.city.toLowerCase();
  const hallsInCity = mockHalls.filter(hall => 
    hall.city.toLowerCase().includes(city)
  );
  
  if (hallsInCity.length > 0) {
    res.json({
      success: true,
      city: city,
      data: hallsInCity,
      count: hallsInCity.length
    });
  } else {
    const availableCities = Array.from(new Set(mockHalls.map(h => h.city)));
    res.status(404).json({
      success: false,
      message: `No halls found in ${city}`,
      availableCities: availableCities
    });
  }
});

// Get all cities
app.get('/api/cities', (req, res) => {
  const cities = Array.from(new Set(mockHalls.map(h => h.city))).sort();
  res.json({
    success: true,
    data: cities,
    count: cities.length
  });
});

// Get hall statistics
app.get('/api/stats', (req, res) => {
  const stats = {
    totalHalls: mockHalls.length,
    totalCities: Array.from(new Set(mockHalls.map(h => h.city))).length,
    avgPrice: Math.round(mockHalls.reduce((sum, h) => sum + h.price, 0) / mockHalls.length),
    avgRating: (mockHalls.reduce((sum, h) => sum + h.rating, 0) / mockHalls.length).toFixed(1),
    maxCapacity: Math.max(...mockHalls.map(h => h.capacity)),
    minPrice: Math.min(...mockHalls.map(h => h.price)),
    maxPrice: Math.max(...mockHalls.map(h => h.price)),
    hallsByCity: mockHalls.reduce((acc, hall) => {
      acc[hall.city] = (acc[hall.city] || 0) + 1;
      return acc;
    }, {})
  };
  
  res.json({
    success: true,
    data: stats
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /api/test',
      'GET /api/halls',
      'GET /api/halls/search',
      'GET /api/halls/:id',
      'GET /api/halls/city/:city',
      'GET /api/cities',
      'GET /api/stats'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started successfully!`);
  console.log(`📡 Local: http://localhost:${PORT}`);
  console.log(`🏨 Total halls loaded: ${mockHalls.length}`);
  console.log(`📍 Cities covered: ${Array.from(new Set(mockHalls.map(h => h.city))).join(', ')}`);
  console.log('\n📋 Available endpoints:');
  console.log('   GET  /              - API Documentation');
  console.log('   GET  /api/test      - Test endpoint');
  console.log('   GET  /api/halls     - All halls');
  console.log('   GET  /api/halls/search - Search halls');
  console.log('   GET  /api/halls/:id - Hall details');
  console.log('   GET  /api/halls/city/:city - Halls by city');
  console.log('   GET  /api/cities    - All cities');
  console.log('   GET  /api/stats     - Statistics');
});