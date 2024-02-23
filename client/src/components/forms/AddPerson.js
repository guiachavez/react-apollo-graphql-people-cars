import React, { useEffect, useState } from 'react'
import { Button, Form, Input } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { useMutation } from '@apollo/client'
import { ADD_PERSON, GET_PERSONS } from '../../graphql/queries'

const AddPerson = () => {
    const styles = getStyles()
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()

    const [addPerson] = useMutation(ADD_PERSON)

    useEffect(() => {
        forceUpdate({})
    }, [])

    const onFinish = (values) => {
        const { firstName, lastName } = values
        const id = uuidv4();
        
        addPerson({
            variables: {
                id,
                firstName,
                lastName
            },
            update: (cache, { data: { addPerson }}) => {
                const data = cache.readQuery({ query: GET_PERSONS })

                if (data && data.persons) {
                    cache.writeQuery({
                        query: GET_PERSONS,
                        data: {
                            ...data,
                            persons: [...data.persons, addPerson]
                        }
                    })
                } 
            }
        })

        form.resetFields()
    }

    return (
        <div style={styles.container}>
            <Form
                name='add-person-form'
                layout='inline'
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    name='firstName'
                    rules={[{ required: true, message: 'Please enter first name' }]}
                    label='First Name:'
                >   
                    <Input placeholder='First Name' />
                </Form.Item>
                <Form.Item
                    name='lastName'
                    rules={[{ required: true, message: 'Please enter last name' }]}
                    label='Last Name:'
                >
                    <Input placeholder='Last Name' />
                </Form.Item>
                <Form.Item shouldUpdate={true}>
                    {() => (
                        <Button
                            type='primary'
                            htmlType='submit'
                            disabled={
                                !form.isFieldsTouched(true) ||
                                !!form.getFieldError().filter(({errors}) => errors.length).length
                            }
                        >
                            Add Person
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddPerson

const getStyles = () => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem'
    }
})
