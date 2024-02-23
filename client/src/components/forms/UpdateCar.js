import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { UPDATE_CAR, GET_PERSONS, GET_CARS, GET_PERSON } from '../../graphql/queries'
import { Button, Form, Input, InputNumber, TreeSelect } from 'antd'


const UpdateCar = (props) => {
    const { id, year, make, model, price, personId } = props
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()
    
    const [updateCar] = useMutation(UPDATE_CAR)
    const [person, setPerson] = useState(personId)

    const onChange = (newValue) => {
        setPerson(newValue);
    };

    useEffect(() => {
        forceUpdate()
    }, [])

    //Query  persons to get the names for the dropdown/treeSelect
    const { loading, error, data } = useQuery(GET_PERSONS)
    const [item, setItem] = useState([])

    useEffect(() => {
        if (data && data.persons) {
            const mappedItems = data.persons.map((i) => ({
                title: `${i.firstName} ${i.lastName}`,
                value: i.id,
                key: i.id,
            }));
        
            setItem(mappedItems);
        }
    }, [data]);

    const onFinish = (values) => {
        const { year, make, model, price, personId} = values

        updateCar({
            variables: {
                id,
                year,
                make,
                model,
                price,
                personId
            },
            update: (cache, { data: {updateCar}}) => {
                const { cars } = cache.readQuery({ query: GET_CARS }) || { cars: [] };
                const carIndex = cars.findIndex((car) => car.id === updateCar.id);

                if (carIndex !== -1) {
                    cache.writeQuery({
                    query: GET_CARS,
                    data: {
                        cars: [
                        ...cars.slice(0, carIndex),
                        updateCar,
                        ...cars.slice(carIndex + 1),
                        ],
                    },
                    });
                }
            }
        })
        props.onButtonClick()
    }

    return (
        <Form
            name='update-car-form'
            layout='inline'
            onFinish={onFinish}
            form={form}
            initialValues={{
                year,
                make,
                model,
                price,
                personId
            }}
        >
            <Form.Item
                name='year'
                rules={[ {required: true, message: 'Please enter year'} ]}
            >
                <InputNumber placeholder='Year'/>
            </Form.Item>

            <Form.Item
                name='make'
                rules={[ {required: true, message: 'Please enter make'} ]}
            >
                <Input placeholder='Make'/>
            </Form.Item>

            <Form.Item
                name='model'
                rules={[ { required: true, message: 'Please enter model'} ]}
            >
                <Input placeholder='Model'/>
            </Form.Item>

            <Form.Item
                name='price'
                rules={[ {required: true, message: 'Please enter price'} ]}
            >
                <InputNumber 
                    defaultValue='$'
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
            </Form.Item>
            <Form.Item
                name='personId'
                rules={[{ required: true, message: 'Please select person' }]}
                label='Person: '
            >
                <TreeSelect 
                    showSearch
                    value={person}
                    placeholder='Select a Person'
                    treeData={item}
                    onChange={onChange}
                />
            </Form.Item>
            <Form.Item shouldUpdate={true}>
                {() => (
                    <Button
                        type='primary'
                        htmlType='submit'
                    >
                        Update
                    </Button>
                )}
            </Form.Item>
            <Button onClick={props.onButtonClick}>Cancel</Button>
        </Form>
    )
}

export default UpdateCar
