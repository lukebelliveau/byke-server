var fetch = require('node-fetch');

const url = 'https://feeds.divvybikes.com/stations/stations.json';

const pullRawData = () => fetch(url)
  .then(response => response.json()
    .then(json => rawData = json));

const getStations = () => pullRawData()
  .then(rawData => rawData['stationBeanList']);

module.exports = getStations
