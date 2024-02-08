const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController.js');

// Route to get market data for a single item
// might need to split this into buy and sell data
router.get('/:itemName/market-data', itemsController.getItemMarketData);

module.exports = router;
