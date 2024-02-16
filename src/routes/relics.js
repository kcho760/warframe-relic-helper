const express = require('express');
const router = express.Router();
const relicsController = require('../controllers/relicsController.js');

// Route to trigger saving all non-vaulted relics to Firestore
router.post('/save-all-relics', async (req, res) => {
    try {
        await relicsController.saveAllNonVaultedRelicsToFirestore();
        res.send('All non-vaulted relics have been saved to Firestore.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving relics to Firestore');
    }
});

// Route to update TEV for all relics in Firestore
router.post('/update-tev', async (req, res) => {
    try {
        await relicsController.updateTEVForAllRelicsByRefinement();
        res.send('TEV updated for all relics.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating TEV for relics');
    }
});

// Route to get information for a specific non-vaulted relic by its name
router.get('/:relicName', relicsController.getRelicDataFromFirestore);

module.exports = router;
