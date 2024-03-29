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
    console.log(response.data); // Log the response data to see what's returned from the API
    return response.data.data;
  } catch (error) {
    console.error('Error response:', error.response);
    console.error('Error status:', error.response && error.response.status);
    console.error('Error data:', error.response && error.response.data);
    return null;
  }
};

module.exports = {
  fetchTopOrders
};
