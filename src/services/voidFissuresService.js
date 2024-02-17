const axios = require('axios');

const fetchActiveVoidFissures = async () => {
  const url = 'https://api.warframestat.us/pc/fissures'; // Example API endpoint for Warframe fissures

  try {
    const response = await axios.get(url);
    // Filter out any fissures where isStorm is true
    const nonStormFissures = response.data.filter(fissure => !fissure.isStorm);
    return nonStormFissures; // This should return an array of active fissures excluding storms
  } catch (error) {
    console.error('Error fetching active void fissures:', error);
    return [];
  }
};

module.exports = {
  fetchActiveVoidFissures
};
