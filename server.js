var express = require('express');
const { graphql, buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

var getStations = require('./fetcher');

let stations = [];

const refreshStations = () =>
  getStations().then(returnedStations =>
    stations = returnedStations
  );

const schema = buildSchema(`
  type Query {
    allStations: [Station]
  }
  
  type Station {
    id: ID,
    stationName: String,
    availableDocks: Int,
    totalDocks: Int,
    availableBikes: Int,
    latitude: Float,
    longitude: Float,
  }
`)

const root = {
  allStations: () => {
    return stations;
  }
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(process.env.PORT || 4000, () => {
  console.log('Started graphQL server!');
  refreshStations();
  setInterval(refreshStations, 10000)
});
