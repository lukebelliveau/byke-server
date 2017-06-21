var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
var { makeExecutableSchema } = require('graphql-tools');
var GraphQLJSON = require('graphql-type-json');

let rawDivvyData = '';

var typeDefs = [`

scalar JSON

type Query {
  allStations: [Station]
}

type Station {
  latitude: Float
  longitude: Float
}

schema {
  query: Query
}`];

var resolvers = {
  Query: {
    allStations() {
      const rawStations = getAllDivvyStations();
      const stations = rawStations.map(station => ({ latitude: station.latitude, longitude: station.longitude }))
      return stations
    }
  },

  JSON: GraphQLJSON
};

var schema = makeExecutableSchema({typeDefs, resolvers});
var app = express();
app.set('port', (process.env.PORT || 4000));
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

const url = 'https://feeds.divvybikes.com/stations/stations.json';
const getRawDivvyData = () =>
  fetch(url)
  .then(response => response.json()
  .then(json => rawDivvyData = json))

const getDivvyStationByIndex = (index) => rawDivvyData['stationBeanList'][index];

const getAllDivvyStations = () => rawDivvyData['stationBeanList']

app.listen(app.get('port'), () => {
  console.log(`Now browse to localhost:${app.get('port')}/graphiql`);
  getRawDivvyData();
});