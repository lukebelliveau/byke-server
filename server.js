var express = require('express');
const { graphql, buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
var fetch = require('node-fetch');

const url = 'https://feeds.divvybikes.com/stations/stations.json';

const schema = buildSchema(`
  type Query {
    hello: String
    allStations: [Station]
  }
  
  type Station {
    latitude: Float,
    longitude: Float,
  }
`)

const root = {
  allStations: () => {
    return fetch(url)
      .then(response => response.json()
        .then(json => json['stationBeanList']))
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
});