import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/client'
import { REMOVE_CAR, GET_CARS } from '../../graphql/queries'

const RemoveCar = ({ id }) => {
    const [removeCar] = useMutation(REMOVE_CAR)

    const removeButtonClick = () => {
        let result = window.confirm('Are you sure you want to delete this record?')

        if(result) {
            try {
                removeCar({
                    variables: {
                        id
                    },
                    update: (cache, { data: { removeCar } }) => {
                        const data = cache.readQuery({ query: GET_CARS })

                        if(data && data.cars) {
                            const updatedCars = data.cars.filter((car) => car.id !== removeCar.id);

                            cache.writeQuery({
                                query: GET_CARS,
                                data: {
                                    cars: updatedCars
                                }
                            })
                            return updatedCars;
                        }
                        return data;
                    }
                })
            } catch(error) {
                console.error(error)
            }
        }
    }

    return (<DeleteOutlined key='delete' style={{ color: 'red' }} onClick={removeButtonClick}/>)
}

export default RemoveCar
