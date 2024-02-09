const express = require('express');
const router = express.Router();
const relicsController = require('../controllers/relicsController.js');

// Route to trigger saving all non-vaulted relics to Firestore
// Assuming you want to manually trigger this process via an API call
router.post('/save-all-relics', async (req, res) => {
    try {
        await relicsController.saveAllNonVaultedRelicsToFirestore();
        res.send('All non-vaulted relics have been saved to Firestore.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving relics to Firestore');
    }
});


// Route to get information for a specific non-vaulted relic by its name
// Updated to use the new function for fetching individual relic data from Firestore
router.get('/:relicName', relicsController.getRelicDataFromFirestore);

module.exports = router;
