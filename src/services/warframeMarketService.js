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

    // Filter to find the first sell order where the user's status is 'ingame'
    const ingameSellOrder = response.data.data.sell
      .find(order => order.user.status === 'ingame');

    // Check if an ingame sell order is found
    if (!ingameSellOrder) {
      console.log('No ingame sell orders available.');
      return null;
    }

    console.log('First ingame sell order:', ingameSellOrder);
    return ingameSellOrder;

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
