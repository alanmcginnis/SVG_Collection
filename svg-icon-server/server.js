const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

const jsonPath = "2025-02-01_svgs.json"

const allowedOrigins = ['http://localhost:8080','http://localhost:8081']; // Replace with your actual production domain(s)

app.use(cors({
  origin: function(origin, callback){
    if(allowedOrigins.indexOf(origin) !== -1 || !origin){ //Adding !origin allows requests from the server itself (if you use it to serve other content)
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}));

// Load the JSON file containing the names and paths of the SVGs
const iconsData = JSON.parse(fs.readFileSync(path.join(__dirname, jsonPath), 'utf8'));

// Endpoint to serve icons with pagination
app.get('/api/icons', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedIcons = iconsData.slice(startIndex, endIndex);

  res.json({
    icons: paginatedIcons,
    totalPages: Math.ceil(iconsData.length / limit),
    currentPage: page
  });
});

// Endpoint to search icons
app.get('/api/icons/search', (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;

  const filteredIcons = iconsData.filter(icon => icon.includes(query));
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedIcons = filteredIcons.slice(startIndex, endIndex);

  res.json({
    icons: paginatedIcons,
    totalPages: Math.ceil(filteredIcons.length / limit),
    currentPage: page
  });
});

// Serve static files (SVGs)
app.use('/icons', express.static(path.join(__dirname, 'icons')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
