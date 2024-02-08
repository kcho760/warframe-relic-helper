const express = require('express');
const cors = require('cors');
const relicRoutes = require('./routes/relics');
const itemsRoutes = require('./routes/items');
const voidFissureRoutes = require('./routes/voidFissures');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // for parsing application/json

// Serve your routes
app.use('/api/relics', relicRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/void-fissures', voidFissureRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello, Warframe World!');
});
 
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
