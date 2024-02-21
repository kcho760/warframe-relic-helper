// itemsController.js

const Bottleneck = require('bottleneck');
const admin = require('firebase-admin');
const { fetchTopOrders, fetchAverageVolumeLast7Days } = require('../services/warframeMarketService');
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
            const topSellerPlatinum = marketData.sell[0].platinum;
            // Preserve existing MarketData and only update the platinumPrice
            drop.MarketData = {
                ...drop.MarketData,
                platinumPrice: topSellerPlatinum
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
    // Iterate over all relics
    for (const relicName in allRelicData) {
        const relic = allRelicData[relicName];
        const updatedRelic = await updateRelicWithMarketData(relic);
        // Get a reference to the Firestore document for the current relic
        const relicDocRef = db.collection('relics').doc(relic.Name.replace(/ /g, '_'));
        // Preserve the existing document data, especially the 7DayVolumeAverage, and merge with the updated market data
        await relicDocRef.set(updatedRelic, { merge: true });
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

const updateDropWith7DayVolumeAverage = async (drop) => {
    if (drop.Item !== 'Forma') {
        const itemUrlName = formatItemNameForUrl(drop.Item, drop.Part);
        let averageVolume = await fetchAverageVolumeLast7Days(itemUrlName);
        averageVolume = Math.round(averageVolume);
        // Update the MarketData object with the new averageVolume, preserving existing data
        drop.MarketData = {
            ...drop.MarketData,
            '7DayVolumeAverage': averageVolume
        };
    }
    return drop;
};


// Function to update all relics with the 7-day volume average
const updateAllRelicsWith7DayVolumeAverage = async () => {
    const db = admin.firestore();
    const relicsRef = db.collection('relics');
    const relicsSnapshot = await relicsRef.get();

    for (const relicDoc of relicsSnapshot.docs) {
        const relicData = relicDoc.data();

        const updatedDrops = await Promise.all(relicData.Drops.map(async (drop) => {
            const updatedDrop = await limiter.schedule(() => updateDropWith7DayVolumeAverage(drop));

            // Ensure MarketData exists and 7DayVolumeAverage is not undefined
            if (updatedDrop.MarketData && typeof updatedDrop.MarketData['7DayVolumeAverage'] === 'undefined') {
                // Set a default value or handle the undefined case as needed
                updatedDrop.MarketData['7DayVolumeAverage'] = 0; // Example default value
            }

            return updatedDrop;
        }));

        // Before updating Firestore, ensure that no drops contain undefined 7DayVolumeAverage
        // This step may be redundant with the above check but is a good final validation
        const validDrops = updatedDrops.filter(drop => drop.MarketData && typeof drop.MarketData['7DayVolumeAverage'] !== 'undefined');

        // Update the relic document with the new drops data, ensuring no undefined values
        await relicDoc.ref.update({ Drops: validDrops });
        console.log(`Updated 7-day volume average for relic: ${relicData.Name}`);
    }

    console.log('All relics have been updated with 7-day volume average.');
};


const itemInfoTester = async (itemName) => {
    try {
        const orderData = await fetchTopOrders(itemName);
        console.log(`Test result for ${itemName}: `, orderData);
        return orderData; // Return the data for further assertions if necessary
    } catch (error) {
        console.error('Error during the test:', error);
    }
};

itemInfoTester('vasto_prime_barrel').then(data => {
    // You can add assertions or additional logs here if needed
});


module.exports = {
    itemInfoTester,
    getItemMarketData,
    updateAllRelicsWithMarketData,
    updateAllRelicsWith7DayVolumeAverage
};
