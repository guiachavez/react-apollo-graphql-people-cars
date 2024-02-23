import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/layout/Header';
import Title from './components/layout/Title';
import AddPerson from './components/forms/AddPerson';
import AddCar from './components/forms/AddCar';
import { GET_PERSONS } from './graphql/queries';
import PersonCarList from './components/lists/PersonCarList';
import PersonWithCars from './components/page/PersonWithCars';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache,
});

function App() {
  const { loading, error, data } = useQuery(GET_PERSONS);

  if (loading) return 'Loading...';
  if (error) return `Error ${error.message}`;

  const personsExist = data && data.persons && data.persons.length > 0;

  return (
    <Router>
      <div className='Root'>
        <Header />

        <Routes>
          <Route path='/person/:id' element={<PersonWithCars />} />

          <Route path="/" element={
            <>
              <Title text='Add Person' />
              <AddPerson />

              {personsExist && (
                <>
                  <Title text='Add Car' />
                  <AddCar />
                </>
              )}

              <Title text='Records' />
              <PersonCarList />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default ApolloApp;
