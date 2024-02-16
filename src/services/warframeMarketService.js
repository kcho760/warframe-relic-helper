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

    // Filter sell orders to exclude any where the user's status is not 'ingame'
    const filteredSellOrders = response.data.data.sell.filter(order => order.user.status === 'ingame');

    // Construct a new object to mimic the original response structure, but only with 'ingame' sell orders
    const filteredResponseData = {
      ...response.data.data,
      sell: filteredSellOrders
    };

    // Log to verify the filtered result
    console.log('Filtered ingame sell orders:', filteredResponseData);
    return filteredResponseData;

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
