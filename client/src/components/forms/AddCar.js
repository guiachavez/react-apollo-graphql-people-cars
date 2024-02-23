import React, { useState, useEffect } from 'react'
import { Form, Input, Button, InputNumber, TreeSelect } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { useMutation, useQuery } from '@apollo/client';
import { ADD_CAR, GET_CARS, GET_PERSONS } from '../../graphql/queries';

const AddCar = () => {
    const styles = getStyles();
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()
    const [addCar] = useMutation(ADD_CAR)

    //For selectTree options
    const [personId, setPersonId] = useState()
    const onChange = (newValue) => {
        setPersonId(newValue);
    };

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

    useEffect(() => {
        forceUpdate({})
    }, [])

    if(loading) return 'Loading...'
    if(error) return `Error ${error.message}`

    const onFinish = (values) => {
        const { year, make, model, price, personId } = values
        const id = uuidv4();
        
        addCar({
            variables: {
                id,
                year,
                make,
                model,
                price,
                personId
            },

            update: (cache, { data: { addCar }}) => {
                const data = cache.readQuery({ query: GET_CARS });

                if (data && data.cars) {
                    // Update the cache with the new car data
                    cache.writeQuery({
                        query: GET_CARS,
                        data: {
                            ...data,
                            cars: [...data.cars, addCar]
                        }
                    });
                }
            }
        })

        form.resetFields()
    }

    return (
        <div style={styles.container}>
            <Form
                name='add-car-form'
                layout='inline'
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    name='year'
                    rules={[{ required: true, message: 'Please enter year' }]}
                    label='Year: '
                >
                    <InputNumber placeholder='Year'/>
                </Form.Item>
                <Form.Item
                    name='make'
                    rules={[{ required: true, message: 'Please enter make' }]}
                    label='Make: '
                >
                    <Input placeholder='Make'/>
                </Form.Item>
                <Form.Item
                    name='model'
                    rules={[{ required: true, message: 'Please enter model' }]}
                    label='Model: '
                >
                    <Input  placeholder='Model' />
                </Form.Item>
                <Form.Item
                    name='price'
                    rules={[{ required: true, message: 'Please enter price' }]}
                    label='Price: '
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
                        value={personId}
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
                            disabled={
                                !form.isFieldsTouched(true) ||
                                !!form.getFieldsError().filter(({ errors }) => errors.length).length
                            }
                        >
                            Add Car
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddCar

const getStyles = () => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem'
    }
})

