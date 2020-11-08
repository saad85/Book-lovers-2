import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloClient,ApolloProvider , InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri:'http://localhost:4000/',
  cache:new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.Fragment>
      <App />
    </React.Fragment>
  </ApolloProvider>
  ,
  document.getElementById('root')
);
