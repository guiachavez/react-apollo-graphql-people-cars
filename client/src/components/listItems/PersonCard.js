import React, { useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import { Card } from 'antd'

import CarCard from './CarCard'
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CARS } from '../../graphql/queries';
import UpdatePerson from '../forms/UpdatePerson';
import RemovePerson from '../buttons/RemovePerson';


const PersonCard = (props) => {
    const { id, firstName, lastName, displayAllCars } = props
    const styles = getStyles();
    const [editMode, setEditMode] = useState(false)
    
    const { loading, error, data } = useQuery(GET_CARS)

    const EditButtonClick = () => {
        setEditMode(!editMode)
    }

    if(loading) return'Loading...'
    if(error) return `Error ${error.message}`

    const cars = data.cars
    const personId = id
    const personPage = `/person/${personId}`
    return (
        <div style={styles.container}>
            {editMode ? <UpdatePerson id={id} firstName={firstName} lastName={lastName} onButtonClick={EditButtonClick}/> :
                <Card
                    title={` ${firstName} ${lastName}`}
                    actions={[
                        <EditOutlined key='edit' onClick={EditButtonClick} />,
                        <RemovePerson id={id} />
                    ]}
                >
                    {displayAllCars ?
                        cars.map((car) => {
                            if(car.personId === id) {
                                return (
                                    <CarCard 
                                        key={car.id}
                                        id={car.id}
                                        year={car.year}
                                        make={car.make}
                                        model={car.model}
                                        price={car.price}
                                        personId={car.personId}
                                    />
                                )
                            }
                            return null
                        }) :
                        cars.filter((car) => car.personId === id).slice(0, 3).map((car) => {
                            return (
                                <CarCard 
                                    key={car.id}
                                    id={car.id}
                                    year={car.year}
                                    make={car.make}
                                    model={car.model}
                                    price={car.price}
                                    personId={car.personId}
                                />
                            )
                        })
                    }

                    {!displayAllCars && cars.filter((car) => car.personId === id).length > 3 && (
                        <div className="learn-more-link">
                        <Link to={personPage}>Learn more</Link>
                        </div>
                    )}
                </Card>
            }  
        </div>
    )
}

export default PersonCard

const getStyles = () => ({
    container: {
      marginBottom: '3rem'
    }
  }) 
  
