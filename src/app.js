const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const relicRoutes = require('./routes/relics');
const itemsRoutes = require('./routes/items');
const voidFissureRoutes = require('./routes/voidFissures');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL) {

  // Initialize Firebase Admin SDK with environment variables
  admin.initializeApp({
      credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      }),
      // Your databaseURL will be something like 'https://<databaseName>.firebaseio.com'
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });

} else {
  console.warn('Firebase environment variables are not set!');
  // Handle the case where environment variables are not set
  // Maybe exit the process or set up a local configuration
}

app.use(cors());

app.use(express.json()); // for parsing application/json

// Combined cron job for updating relics market data and 7-day volume
cron.schedule('0 * * * *', async () => {
  try {
    // First, update relics market data
    const marketDataResponse = await axios.post('https://warframe-relic-app.onrender.com/api/items/update-relics-market-data');
    console.log('Relics market data update response:', marketDataResponse.data);

    // Then, update relics 7-day volume
    const volumeResponse = await axios.post('https://warframe-relic-app.onrender.com/api/items/update-relics-7-day-volume');
    console.log('Relics 7-day volume update response:', volumeResponse.data);
  } catch (error) {
    console.error('Error in combined cron job:', error);
  }
});

cron.schedule('5 * * * *', async () => {
  try {
    const response = await axios.post('https://warframe-relic-app.onrender.com/api/relics/update-tev');
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
