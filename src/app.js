const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const relicRoutes = require('./routes/relics');
const itemsRoutes = require('./routes/items');
const voidFissureRoutes = require('./routes/voidFissures');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin SDK with appropriate credentials
const serviceAccount = require('../warframe-relic-app-firebase-adminsdk-jhq8n-9149d732c0.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://console.firebase.google.com/u/0/project/warframe-relic-app/firestore/data/~2F'
});
const corsOptions = {
  origin: 'https://warframe-relic-app.web.app', // Your production domain
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json()); // for parsing application/json

cron.schedule('0 * * * *', async () => {
  try {
    const response = await axios.post('https://warframe-relic-app.web.app/api/items/update-relics-market-data');
    console.log('Relics market data update response:', response.data);
  } catch (error) {
    console.error('Error updating relics market data:', error);
  }
});

cron.schedule('0 * * * *', async () => {
  try {
    const response = await axios.post('https://warframe-relic-app.web.app/api/relics/update-tev');
    console.log('TEV update response:', response.data);
  } catch (error) {
    console.error('Error updating TEV:', error);
  }
});

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
