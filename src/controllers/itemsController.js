// itemsController.js

const { fetchTopOrders } = require('../services/warframeMarketService');

const getItemMarketData = async (req, res) => {
    const { itemName } = req.params;

    try {
        const topOrders = await fetchTopOrders(itemName);

        // If the fetchTopOrders function returns null (indicating an error), handle appropriately
        if (!topOrders) {
            return res.status(500).send('Failed to fetch top orders');
        }

        // Extract the top buy and sell orders
        const topSellOrders = topOrders.sell ? topOrders.sell.slice(0, 1) : [];
        const topBuyOrders = topOrders.buy ? topOrders.buy.slice(0, 1) : [];

        // Respond with the top buy and sell orders
        res.json({
            itemName: itemName,
            topSellOrders: topSellOrders,
            topBuyOrders: topBuyOrders
        });
    } catch (error) {
        console.error('Error fetching market data:', error);
        res.status(500).send('Failed to fetch market data');
    }
};

module.exports = {
    getItemMarketData,
};
