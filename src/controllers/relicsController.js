const admin = require('firebase-admin');
const { getNonVaultedRelicsSorted } = require('../services/snekwWikiService');


// Function to save relic data to Firestore
const saveRelicDataToFirestore = async (relicData) => {
    const db = admin.firestore();
    const relicRef = db.collection('relics').doc(); // This will generate a unique document ID
    await relicRef.set(relicData); // Use set() to save data to the document reference
};


// Adjusted function to save all non-vaulted relics to Firestore using the relic name as the document ID
const saveAllNonVaultedRelicsToFirestore = async () => {
    const db = admin.firestore();
    try {
        const allRelicData = await getNonVaultedRelicsSorted();
        if (!allRelicData) {
            console.error('Failed to fetch relic data');
            return;
        }

        // Batch saving using the relic name as the document ID
        for (const relicName in allRelicData) {
            const relicData = allRelicData[relicName];
            await db.collection('relics').doc(relicName.replace(/ /g, '_')).set(relicData);
            console.log(`Saved ${relicName} data to Firestore`);
        }

        console.log('All non-vaulted relic data saved to Firestore');
    } catch (error) {
        console.error('Error saving all non-vaulted relics to Firestore:', error);
    }
};

// New function to retrieve individual relic data from Firestore
const getRelicDataFromFirestore = async (req, res) => {
    const { relicName } = req.params; // Expecting relic name in the URL with underscores
    const db = admin.firestore();

    try {
        const doc = await db.collection('relics').doc(relicName).get();
        if (!doc.exists) {
            return res.status(404).send('Relic not found');
        }

        res.status(200).json(doc.data());
    } catch (error) {
        console.error('Error retrieving relic data:', error);
        res.status(500).send('Failed to retrieve relic data');
    }
};

// Function to calculate the TEV for a single relic
const calculateTEV = (drops, refinementLevel) => {
  // Drop chances based on refinement level from the provided table
  const dropChancesByRefinement = {
    Intact: { "Common": 76 / 100, "Uncommon": 22 / 100, "Rare": 2 / 100 },
    Exceptional: { "Common": 70 / 100, "Uncommon": 26 / 100, "Rare": 4 / 100 },
    Flawless: { "Common": 60 / 100, "Uncommon": 34 / 100, "Rare": 6 / 100 },
    Radiant: { "Common": 50 / 100, "Uncommon": 40 / 100, "Rare": 10 / 100 },
  };

  const dropChances = dropChancesByRefinement[refinementLevel];

  // Calculate the TEV using the market data and the drop chances for the specified refinement level
  const tev = drops.reduce((acc, drop) => {
    const chance = dropChances[drop.Rarity];
    const price = drop.MarketData?.platinumPrice || 0;
    return acc + (chance * price);
  }, 0);

  return Number(tev.toFixed(2));
};
  
// Function to update the TEV for each relic in Firestore for each refinement level
const updateTEVForAllRelicsByRefinement = async () => {
  const db = admin.firestore();
  const relicsRef = db.collection('relics');
  const refinementLevels = ['Intact', 'Exceptional', 'Flawless', 'Radiant'];

  try {
    const snapshot = await relicsRef.get();
    const batch = db.batch();

    snapshot.forEach(doc => {
      const relicData = doc.data();
      const tevByRefinement = {};

      // Calculate TEV for each refinement level and store it in an object
      refinementLevels.forEach(level => {
        tevByRefinement[`${level}TEV`] = calculateTEV(relicData.Drops, level);
      });

      // Update the document with the TEV for each refinement level
      batch.update(doc.ref, tevByRefinement);
    });

    // Commit the batch update
    await batch.commit();
    console.log('TEV updated for all relics at each refinement level.');
  } catch (error) {
    console.error('Error updating TEV for relics at each refinement level:', error);
  }
};

  
module.exports = {
    saveAllNonVaultedRelicsToFirestore,
    getRelicDataFromFirestore,
    updateTEVForAllRelicsByRefinement
};