const admin = require('firebase-admin');
const { getNonVaultedRelicsSorted } = require('../services/snekwWikiService');


// Function to save relic data to Firestore
const saveRelicDataToFirestore = async (relicData) => {
    const db = admin.firestore();
    const relicRef = db.collection('relics').doc(); // This will generate a unique document ID
    await relicRef.set(relicData); // Use set() to save data to the document reference
};


const getNonVaultedRelicInfo = async (req, res) => {
    let { relicName } = req.params;
    relicName = relicName.replace(/_/g, ' ');

    try {
        const relicData = await getNonVaultedRelicsSorted();
        if (!relicData) {
            return res.status(500).send('Failed to fetch data');
        }

        const relicInfo = relicData[relicName];
        if (!relicInfo) {
            return res.status(404).send('Relic not found. It may be vaulted, not exist, or the name is incorrect.');
        }

        // Save relic data to Firestore
        await saveRelicDataToFirestore(relicInfo);

        res.status(200).send('Relic data saved to Firestore'); // Send a success message
    } catch (error) {
        console.error('Error fetching relic info:', error);
        res.status(500).send('Failed to fetch relic info');
    }
};

const getAllNonVaultedRelicNames = async () => {
    try {
        const relicData = await getNonVaultedRelicsSorted();
        if (!relicData) {
            console.error('Failed to fetch data');
            return [];
        }
        
        // Extract the names of all non-vaulted relics
        const relicNames = Object.keys(relicData);
        console.log('Non-vaulted relic names:', relicNames);
        return relicNames;
    } catch (error) {
        console.error('Error fetching relic data:', error);
        return [];
    }
};

module.exports = {
    getNonVaultedRelicInfo,
    getAllNonVaultedRelicNames
};