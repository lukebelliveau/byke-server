var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
var { makeExecutableSchema } = require('graphql-tools');

let rawDivvyData = '';

var typeDefs = [`
type Query {
  hello(name: String): String
  rawData: String
  station(index: Int): String
}

schema {
  query: Query
}`];

var resolvers = {
  Query: {
    hello(root, args) {
      return args.name;
    },
    rawData() {
      return rawDivvyData;
    },
    station(obj, args) {
      return getDivvyStationByIndex(args.index);
    }
  }
};

var schema = makeExecutableSchema({typeDefs, resolvers});
var app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

const url = 'https://feeds.divvybikes.com/stations/stations.json';
const getRawDivvyData = () =>
  fetch(url)
  .then(response => response.json()
  .then(json => rawDivvyData = json))

const getDivvyStationByIndex = (index) => rawDivvyData['stationBeanList'][index];

app.listen(4000, () => {
  console.log('Now browse to localhost:4000/graphiql');
  getRawDivvyData();
});