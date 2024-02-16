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
// Assuming you have a function itemInfoTester in itemsController that expects an itemName

// Route to test market data fetch for a single item
router.get('/test-item/:itemName', async (req, res) => {
    const { itemName } = req.params; // Extract itemName from the request parameters
    try {
        const data = await itemsController.itemInfoTester(itemName); // Call the itemInfoTester function with the itemName
        res.status(200).json(data); // Respond with the data received from the itemInfoTester function
    } catch (error) {
        console.error(error);
        res.status(500).send('Error testing item market data');
    }
});

module.exports = router;
