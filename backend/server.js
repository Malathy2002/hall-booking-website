const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Get the directory name
const __dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Mock halls data with proper images
const halls = [
  {
    id: 1,
    name: "Ariyalur Grand Wedding Palace",
    city: "Ariyalur",
    address: "123 Wedding Street, Ariyalur",
    capacity: 500,
    price: 50000,
    maxGuests: 500,
    minGuests: 100,
    description: "A beautiful wedding palace with excellent facilities for all types of events. Perfect for grand weddings and receptions.",
    eventTypes: ["wedding", "reception", "engagement"],
    amenities: ["AC", "Parking", "Catering", "Stage", "Lighting", "Sound System", "Decoration"],
    rating: 4.5,
    totalReviews: 120,
    contact: "9876543210",
    owner: "John Doe",
    // REAL IMAGES
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop"
    ],
    rules: [
      "No smoking inside the hall",
      "No outside food allowed",
      "Music must stop by 11 PM",
      "Advance booking required"
    ],
    features: [
      "5000 sq.ft area",
      "Separate parking for 100 cars",
      "Full AC",
      "In-house catering available",
      "Professional sound system"
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
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
    description: "Modern hall perfect for corporate events, birthdays, and small weddings. Located in the heart of Chennai.",
    eventTypes: ["wedding", "birthday", "corporate", "conference"],
    amenities: ["AC", "Parking", "Sound System", "Projector", "WiFi", "Catering"],
    rating: 4.3,
    totalReviews: 85,
    contact: "9876543211",
    owner: "Jane Smith",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop"
    ],
    rules: [
      "Corporate events only on weekdays",
      "Decoration allowed",
      "Parking available for 50 cars"
    ],
    features: [
      "3000 sq.ft area",
      "Modern lighting system",
      "High-speed WiFi",
      "Projector and screen",
      "Business lounge"
    ],
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10"
  },
  {
    id: 3,
    name: "Ariyalur Party Zone",
    city: "Ariyalur",
    address: "789 Party Road, Ariyalur",
    capacity: 200,
    price: 25000,
    maxGuests: 200,
    minGuests: 30,
    description: "The ultimate party destination with DJ booth, dance floor, and bar facilities. Perfect for birthdays and celebrations.",
    eventTypes: ["birthday", "party", "get-together", "anniversary"],
    amenities: ["DJ Booth", "Dance Floor", "Bar", "Food Court", "Lighting", "Sound System"],
    rating: 4.2,
    totalReviews: 65,
    contact: "9876543212",
    owner: "Mike Johnson",
    images: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519677100203-9ffc4e1e9bdb?w=800&auto=format&fit=crop"
    ],
    rules: [
      "Age restriction: 18+",
      "Outside alcohol not allowed",
      "Booking deposit required"
    ],
    features: [
      "Special DJ booth",
      "LED dance floor",
      "Bar counter",
      "Food stalls area",
      "Party lighting"
    ],
    createdAt: "2024-03-05",
    updatedAt: "2024-03-05"
  },
  {
    id: 4,
    name: "Coimbatore Royal Banquet",
    city: "Coimbatore",
    address: "101 Royal Street, Coimbatore",
    capacity: 400,
    price: 45000,
    maxGuests: 400,
    minGuests: 80,
    description: "Luxurious banquet hall for royal weddings and high-profile events. Gold-plated decorations and premium services.",
    eventTypes: ["wedding", "reception", "banquet", "corporate"],
    amenities: ["AC", "Valet Parking", "Premium Catering", "Stage", "Royal Decor", "Sound System", "Floral Arrangements"],
    rating: 4.7,
    totalReviews: 150,
    contact: "9876543213",
    owner: "Rajesh Kumar",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop"
    ],
    rules: [
      "Premium events only",
      "Booking 3 months in advance",
      "Five-star catering mandatory",
      "No plastic decorations"
    ],
    features: [
      "Royal-themed decor",
      "Valet parking service",
      "Gold-plated cutlery",
      "Professional event planners",
      "Floral ceiling arrangements"
    ],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20"
  },
  {
    id: 5,
    name: "Madurai Traditional Hall",
    city: "Madurai",
    address: "202 Temple Road, Madurai",
    capacity: 350,
    price: 30000,
    maxGuests: 350,
    minGuests: 60,
    description: "Traditional South Indian style wedding hall with authentic decor and traditional catering options.",
    eventTypes: ["wedding", "reception", "traditional", "family"],
    amenities: ["AC", "Parking", "Traditional Catering", "Stage", "Temple-like Decor", "Sound System"],
    rating: 4.4,
    totalReviews: 95,
    contact: "9876543214",
    owner: "Sundar Rajan",
    images: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop"
    ],
    rules: [
      "Traditional attire preferred",
      "Vegetarian food only",
      "Classical music allowed",
      "Traditional decor provided"
    ],
    features: [
      "Traditional kolam flooring",
      "Temple-style architecture",
      "South Indian cuisine",
      "Classical music system",
      "Traditional seating"
    ],
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15"
  }
];

// Home page (API documentation)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hall Booking System - Backend</title>
      <style>
        body { font-family: Arial; padding: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; }
        .success { color: #27ae60; font-weight: bold; }
        .endpoint { background: #f8f9fa; padding: 10px; border-left: 4px solid #3498db; margin: 10px 0; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
        .get { background: #d4edda; color: #155724; }
        .post { background: #d1ecf1; color: #0c5460; }
        .put { background: #fff3cd; color: #856404; }
        .delete { background: #f8d7da; color: #721c24; }
        code { background: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ Hall Booking System Backend</h1>
        <p class="success">Server is running successfully!</p>
        <p>Server time: ${new Date().toISOString()}</p>
        <p>Total halls: ${halls.length}</p>
        
        <h3>📡 Available Endpoints:</h3>
        
        <div class="endpoint">
          <span class="method get">GET</span> <strong>/api/test</strong><br>
          <a href="/api/test">Test API connection</a>
        </div>
        
        <div class="endpoint">
          <span class="method get">GET</span> <strong>/api/halls</strong><br>
          Get all halls<br>
          <a href="/api/halls">View all halls</a>
        </div>
        
        <div class="endpoint">
          <span class="method get">GET</span> <strong>/api/halls/search</strong><br>
          Search halls with filters<br>
          Parameters: location, guests, eventType<br>
          <a href="/api/halls/search?location=Ariyalur&guests=300">Example: Search halls in Ariyalur for 300 guests</a>
        </div>
        
        <div class="endpoint">
          <span class="method get">GET</span> <strong>/api/halls/:id</strong><br>
          Get hall details by ID<br>
          <a href="/api/halls/1">Example: Get hall with ID 1</a>
        </div>
        
        <div class="endpoint">
          <span class="method put">PUT</span> <strong>/api/halls/:id</strong><br>
          Update hall information<br>
          Requires JSON body with hall data
        </div>
        
        <div class="endpoint">
          <span class="method post">POST</span> <strong>/api/halls</strong><br>
          Create new hall<br>
          Requires JSON body with hall data
        </div>
        
        <div class="endpoint">
          <span class="method delete">DELETE</span> <strong>/api/halls/:id</strong><br>
          Delete hall by ID<br>
          <code>Example: DELETE /api/halls/1</code>
        </div>
        
        <h3>🔧 Update Hall Example (cURL):</h3>
        <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; overflow: auto;">
curl -X PUT http://localhost:${process.env.PORT || 5000}/api/halls/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Updated Hall Name",
    "price": 55000,
    "description": "Updated description",
    "amenities": ["AC", "Parking", "Catering", "Stage", "Lighting", "Sound System", "Decoration", "WiFi"]
  }'</pre>
        
        <h3>🎨 React Frontend:</h3>
        <p>The React frontend is served at the root path. Visit <a href="/">the main page</a> for the React application.</p>
      </div>
    </body>
    </html>
  `);
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working!",
    timestamp: new Date().toISOString(),
    status: "active",
    totalHalls: halls.length
  });
});

// Get all halls
app.get("/api/halls", (req, res) => {
  res.json({
    success: true,
    count: halls.length,
    data: halls
  });
});

// Hall search endpoint
app.get("/api/halls/search", (req, res) => {
  const { location = "", guests = "", eventType = "", minPrice = "", maxPrice = "" } = req.query;

  let results = [...halls];

  if (location) {
    results = results.filter(h => 
      h.city.toLowerCase().includes(location.toLowerCase()) ||
      h.name.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (guests) {
    const guestCount = parseInt(guests);
    if (!isNaN(guestCount)) {
      results = results.filter(h => guestCount >= h.minGuests && guestCount <= h.maxGuests);
    }
  }

  if (eventType) {
    results = results.filter(h => 
      h.eventTypes.map(e => e.toLowerCase()).includes(eventType.toLowerCase())
    );
  }

  if (minPrice) {
    const min = parseInt(minPrice);
    if (!isNaN(min)) {
      results = results.filter(h => h.price >= min);
    }
  }

  if (maxPrice) {
    const max = parseInt(maxPrice);
    if (!isNaN(max)) {
      results = results.filter(h => h.price <= max);
    }
  }

  res.json({
    success: true,
    count: results.length,
    filters: { location, guests, eventType, minPrice, maxPrice },
    data: results
  });
});

// Hall detail endpoint
app.get('/api/halls/:id', (req, res) => {
  const hallId = parseInt(req.params.id);
  if (isNaN(hallId)) {
    return res.status(400).json({ success: false, message: "Invalid hall ID" });
  }

  const hall = halls.find(h => h.id === hallId);
  if (!hall) {
    return res.status(404).json({ success: false, message: "Hall not found" });
  }

  res.json({ success: true, data: hall });
});

// UPDATE hall endpoint
app.put('/api/halls/:id', (req, res) => {
  const hallId = parseInt(req.params.id);
  if (isNaN(hallId)) {
    return res.status(400).json({ success: false, message: "Invalid hall ID" });
  }

  const hallIndex = halls.findIndex(h => h.id === hallId);
  if (hallIndex === -1) {
    return res.status(404).json({ success: false, message: "Hall not found" });
  }

  const updateData = req.body;
  
  // List of fields that can be updated
  const allowedFields = [
    'name', 'city', 'address', 'capacity', 'price', 'maxGuests', 'minGuests',
    'description', 'eventTypes', 'amenities', 'rating', 'totalReviews', 
    'contact', 'owner', 'images', 'rules', 'features'
  ];

  // Update only allowed fields
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      halls[hallIndex][field] = updateData[field];
    }
  });

  // Update timestamp
  halls[hallIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Hall updated successfully",
    data: halls[hallIndex]
  });
});

// CREATE new hall endpoint
app.post('/api/halls', (req, res) => {
  const newHall = req.body;
  
  // Generate new ID
  const newId = halls.length > 0 ? Math.max(...halls.map(h => h.id)) + 1 : 1;
  
  const hall = {
    id: newId,
    name: newHall.name || "New Hall",
    city: newHall.city || "Unknown",
    address: newHall.address || "",
    capacity: newHall.capacity || 100,
    price: newHall.price || 20000,
    maxGuests: newHall.maxGuests || 100,
    minGuests: newHall.minGuests || 20,
    description: newHall.description || "",
    eventTypes: newHall.eventTypes || ["wedding"],
    amenities: newHall.amenities || ["AC", "Parking"],
    rating: newHall.rating || 4.0,
    totalReviews: newHall.totalReviews || 0,
    contact: newHall.contact || "",
    owner: newHall.owner || "",
    images: newHall.images || ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop"],
    rules: newHall.rules || [],
    features: newHall.features || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  halls.push(hall);
  
  res.status(201).json({
    success: true,
    message: "Hall created successfully",
    data: hall
  });
});

// DELETE hall endpoint
app.delete('/api/halls/:id', (req, res) => {
  const hallId = parseInt(req.params.id);
  if (isNaN(hallId)) {
    return res.status(400).json({ success: false, message: "Invalid hall ID" });
  }

  const hallIndex = halls.findIndex(h => h.id === hallId);
  if (hallIndex === -1) {
    return res.status(404).json({ success: false, message: "Hall not found" });
  }

  const deletedHall = halls.splice(hallIndex, 1)[0];
  
  res.json({
    success: true,
    message: "Hall deleted successfully",
    data: deletedHall
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// ====== PRODUCTION CONFIGURATION ======

// In production, serve React build folder
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // In development, show API documentation at root
  app.get('*', (req, res) => {
    res.redirect('/');
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("✅ Server started successfully!");
  console.log(`📡 Local: http://localhost:${PORT}`);
  console.log(`🎨 React frontend served from: ${path.join(__dirname, '../frontend/build')}`);
  console.log(`🎯 Total halls loaded: ${halls.length}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log("\n🚀 Available API endpoints:");
  console.log("   GET    /api/test");
  console.log("   GET    /api/halls");
  console.log("   GET    /api/halls/search");
  console.log("   GET    /api/halls/:id");
  console.log("   PUT    /api/halls/:id");
  console.log("   POST   /api/halls");
  console.log("   DELETE /api/halls/:id");
  console.log("\n🌐 All other routes serve the React frontend");
});