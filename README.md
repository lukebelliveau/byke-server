# byke-server
serving bikeshare data with graphQL

served from [https://byke-graphql.herokuapp.com]

send requests to [https://byke-graphql.herokuapp.com/graphql?query=]

for example:
```es6
    fetch(https://byke-graphql.herokuapp.com/graphql?query={allStations{latitude}})
        .then(...)
```

documented with GraphiQL [here](https://byke-graphql.herokuapp.com/graphql)