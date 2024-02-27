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
    // console.log('Filtered ingame sell orders:', filteredResponseData);
    return filteredResponseData;

  } catch (error) {
    console.error('Error response:', error.response);
    console.error('Error status:', error.response && error.response.status);
    console.error('Error data:', error.response && error.response.data);
    return null;
  }
};

async function fetchAverageVolumeLast7Days(itemUrlName) {
  const url = `https://api.warframe.market/v1/items/${encodeURIComponent(itemUrlName)}/statistics`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const statsClosed90Days = data.payload.statistics_closed['90days'];
    
    // Assuming that the stats are sorted from newest to oldest, slice the last 7 entries
    const last7Days = statsClosed90Days.slice(-7);

    // Calculate the average volume
    const totalVolume = last7Days.reduce((acc, day) => acc + day.volume, 0);
    const averageVolume = totalVolume / last7Days.length;

    console.log(`Average volume over the last 7 days: ${averageVolume}`);
    return averageVolume;
  } catch (error) {
    console.error("There was an error fetching the average volume:", error);
    console.error("itemName:", itemUrlName);
  }
}

module.exports = {
  fetchAverageVolumeLast7Days,
  fetchTopOrders
};
