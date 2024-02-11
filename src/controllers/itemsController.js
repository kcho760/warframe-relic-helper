// itemsController.js

const Bottleneck = require('bottleneck');
const admin = require('firebase-admin');
const { fetchTopOrders } = require('../services/warframeMarketService');
const { getNonVaultedRelicsSorted } = require('../services/snekwWikiService');

// Initialize a new Bottleneck limiter
const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 334 // Slightly higher than 333.33 to account for any processing time
});

const formatItemNameForUrl = (itemName, itemPart) => {
    return `${itemName.toLowerCase()}_${itemPart.toLowerCase()}`.replace(/ /g, '_');
};

const updateDropWithMarketData = async (drop) => {
    if (drop.Item !== 'Forma') {
        const itemUrlName = formatItemNameForUrl(drop.Item, drop.Part);
        const marketData = await fetchTopOrders(itemUrlName);
        if (marketData && marketData.sell && marketData.sell.length > 0) {
            const topSellerPlatinum = marketData.sell[0].platinum; // Assuming the first order in the array has the platinum price
            return {
                ...drop,
                MarketData: {
                    platinumPrice: topSellerPlatinum // Update the platinum price in the MarketData object
                }
            };
        }
    }
    return drop;
};

// Function that updates all drops within a relic with market data
const updateRelicWithMarketData = async (relic) => {
    const updatedDrops = await Promise.all(relic.Drops.map(drop =>
        limiter.schedule(() => updateDropWithMarketData(drop))
    ));
    console.log(`Updated ${relic.Name} with market data.`);

    return { ...relic, Drops: updatedDrops };
};

// Function to update all relics with market data
const updateAllRelicsWithMarketData = async () => {
    const db = admin.firestore();
    const allRelicData = await getNonVaultedRelicsSorted();
    // const relicNames = Object.keys(allRelicData).slice(0, 1); // Get only the first 3 relics for testing

    for (const relicName in allRelicData) {
        const relic = allRelicData[relicName];
        const updatedRelic = await updateRelicWithMarketData(relic);

        // Before saving, log the updated relic object to verify the structure
        console.log(`Saving updated relic data for ${relic.Name}: `, JSON.stringify(updatedRelic, null, 2));

        // Save the updated relic document with market data, merge with existing data
        await db.collection('relics').doc(relic.Name.replace(/ /g, '_')).set(updatedRelic, { merge: true });
        console.log(`Updated ${relic.Name} with market data.`);
    }

    console.log('All relics have been updated with market data.');
};


// Existing function to get market data for an individual item
const getItemMarketData = async (req, res) => {
    const { itemName } = req.params;

    try {
        const topOrders = await fetchTopOrders(itemName);

        if (!topOrders) {
            return res.status(500).send('Failed to fetch top orders');
        }

        const topSellOrders = topOrders.sell ? topOrders.sell.slice(0, 1) : [];
        const topBuyOrders = topOrders.buy ? topOrders.buy.slice(0, 1) : [];

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
    updateAllRelicsWithMarketData // Export the new function for use in other parts of the application
};
