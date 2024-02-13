const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController.js');

// Route to get market data for a single item
// might need to split this into buy and sell data
router.get('/:itemName/market-data', itemsController.getItemMarketData);

// Route to trigger updating all relics with market data
// Assuming you want to manually trigger this process via an API call
router.post('/update-relics-market-data', async (req, res) => {
    try {
        await itemsController.updateAllRelicsWithMarketData();
        res.send('All relics have been updated with market data.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating relics with market data');
    }
});

router.get('/item-info-tester', itemsController.itemInfoTester);

module.exports = router;
