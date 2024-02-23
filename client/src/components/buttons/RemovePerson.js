import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/client'
import { useNavigate, useLocation } from 'react-router-dom';
import { GET_CARS, GET_PERSONS, REMOVE_CAR, REMOVE_PERSON } from '../../graphql/queries'

const RemovePerson = ({ id }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [removePerson] = useMutation(REMOVE_PERSON)
    const [removeCar] = useMutation(REMOVE_CAR)

    const removeButtonClick = async () => {
        let result = window.confirm('Are you sure you want to delete this record?')

        if(result) {
            try {
                await removePerson({
                    variables: {
                        id
                    },
                    update: ( cache, { data: { removePerson } }) => {
                        const dataPersons = cache.readQuery({ query: GET_PERSONS });
                        const dataCars = cache.readQuery({ query: GET_CARS });

                        if(dataPersons && dataPersons.persons) {
                            if (dataPersons && dataPersons.persons) {
                                const updatedPersons = dataPersons.persons.filter((p) => p.id !== removePerson.id);
                    
                                cache.writeQuery({
                                    query: GET_PERSONS,
                                    data: {
                                        persons: updatedPersons
                                    }
                                });
                            }
                    
                            if (dataCars && dataCars.cars) {
                                const updatedCars = dataCars.cars.filter((car) => car.personId !== removePerson.id);
                    
                                cache.writeQuery({
                                    query: GET_CARS,
                                    data: {
                                        cars: updatedCars
                                    }
                                });
                            }
                            // if (carsData && carsData.cars) {
                            //     const updatedCars = carsData.cars.filter((car) => car.personId !== removePerson.id);

                
                            //     cache.writeQuery({
                            //         query: GET_CARS,
                            //         data: {
                            //             cars: updatedCars
                            //         }
                            //     });
                            // }

                            // cache.writeQuery({
                            //     query: GET_PERSONS,
                            //     data: {
                            //         persons: updatedPersons
                            //     }
                            // })
                        }
                    }
                })

                if (location.pathname.includes(`/person/${id}`)) {
                    navigate('/');
                }

            } catch(error) {
                console.error(error);
            }
        }
    }

    return (<DeleteOutlined key='delete' style={{ color: 'red' }} onClick={removeButtonClick}/>)
}

export default RemovePerson
