const axios = require('axios');

// Function to fetch relic data from the external API
const fetchVoidRelicData = async () => {
  const url = 'https://wf.snekw.com/void-wiki'; // The endpoint with the JSON data

  try {
    const response = await axios.get(url);
    return response.data.data.RelicData; // Assuming this returns the relevant relic data
  } catch (error) {
    console.error('Error fetching void relic data:', error);
    return null;
  }
};

const tierOrder = ['Lith', 'Meso', 'Neo', 'Axi', 'Requiem']; // Define the order of tiers

// Function to get only non-vaulted relics and sort them
const getNonVaultedRelicsSorted = async () => {
    try {
        const relicData = await fetchVoidRelicData();
        if (!relicData) {
            console.error('Failed to fetch data');
            return {};
        }
        
        // Filter and sort the relics
        const nonVaultedSortedRelics = Object.entries(relicData)
            .filter(([key, value]) => !value.Vaulted) // Filter out vaulted relics
            .sort((a, b) => {
                const aTier = a[0].split(' ')[0];
                const bTier = b[0].split(' ')[0];
                const aTierIndex = tierOrder.indexOf(aTier);
                const bTierIndex = tierOrder.indexOf(bTier);

                if (aTierIndex !== bTierIndex) {
                    return aTierIndex - bTierIndex; // Sort by tier first
                } else {
                    return a[0].localeCompare(b[0]); // Then alphabetically
                }
            })
            .reduce((acc, [key, value]) => {
                acc[key] = value; // Convert the sorted array back into an object
                return acc;
            }, {});
        console.log('Non-vaulted sorted relics:', nonVaultedSortedRelics)
        return nonVaultedSortedRelics;
    } catch (error) {
        console.error('Error processing relic data:', error);
        return {};
    }
};

module.exports = {
  fetchVoidRelicData,
  getNonVaultedRelicsSorted
};
