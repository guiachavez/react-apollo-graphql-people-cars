import React from 'react'
import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom'
import { GET_PERSON } from '../../graphql/queries';
import { Card, List, Button } from 'antd';
import CarCard from '../listItems/CarCard';
import PersonCard from '../listItems/PersonCard';

const PersonWithCars = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const styles = getStyles()

    const { loading, error, data } = useQuery(GET_PERSON, {
        variables: { id },
    });

    if(loading) return 'Loading...'
    if(error) return `Error ${error.message}`
    const person = data.person; 

    return (
        <div style={styles.container}>
            <Button onClick={() => navigate(-1)}>Go back</Button>
            <div style={styles.personContainer}>
                <PersonCard 
                    id={person.id}
                    firstName={person.firstName}
                    lastName={person.lastName}
                    cars={person.cars}
                    displayAllCars={true}
                />
            </div>
        </div>
    )
}

export default PersonWithCars

const getStyles = () => ({
    container: {
      width: '90%',
      paddingTop: '3rem',
      margin: 'auto'
    },
    personContainer: {
        paddingTop: '3rem'
    }
  })
  