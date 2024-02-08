const axios = require('axios');

const fetchActiveVoidFissures = async () => {
  const url = 'https://api.warframestat.us/pc/fissures'; // Example API endpoint for Warframe fissures

  try {
    const response = await axios.get(url);
    return response.data; // This should return an array of active fissures
  } catch (error) {
    console.error('Error fetching active void fissures:', error);
    return [];
  }
};

module.exports = {
  fetchActiveVoidFissures
};
