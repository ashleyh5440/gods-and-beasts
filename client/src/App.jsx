import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import './App.css'
import {setContext} from '@apollo/client/link/context';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client = {client}>
      <main>
        <Outlet />
        <Footer />
      </main>
    </ApolloProvider>
  )
};

export default App;
