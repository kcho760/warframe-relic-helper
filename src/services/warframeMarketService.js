// warframeMarketService.js

const axios = require('axios');

const fetchTopOrders = async (itemUrlName) => {
  const url = `https://api.warframe.market/v2/orders/item/${encodeURIComponent(itemUrlName)}/top`;
  try {
    const response = await axios.get(url, {
      headers: {
        'accept': 'application/json',
        'Platform': 'pc', // Make sure to use the correct platform if necessary
      }
    });
    // Assuming the response structure matches the v2 API format
    return response.data.data;
  } catch (error) {
    console.error('Error response:', error.response);
    console.error('Error status:', error.response.status);
    console.error('Error data:', error.response.data);
    return null;
  }
  
};

module.exports = {
  fetchTopOrders
};
