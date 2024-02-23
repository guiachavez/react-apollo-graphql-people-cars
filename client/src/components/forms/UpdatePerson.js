import React, { useEffect, useState } from 'react'
import { Button, Form, Input } from 'antd'
import { useMutation } from '@apollo/client'
import { UPDATE_PERSON, GET_PERSON } from '../../graphql/queries'

const UpdatePerson = (props) => {
    const { id, firstName, lastName } = props
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()

    const [updatePerson] = useMutation(UPDATE_PERSON)

    const onFinish = (values) => {
        const { firstName, lastName } = values

        updatePerson({
            variables: {
                id,
                firstName,
                lastName
            },
            update: (cache, { data: { updatePerson }}) => {
                const data = cache.readQuery({ query: GET_PERSON })

                if (data && data.person) {
                    cache.writeQuery({
                        query: GET_PERSON,
                        data: {
                            person: updatePerson
                        }
                    })
                } 
            }
        })
        props.onButtonClick()
    }

    useEffect(() => {
        forceUpdate()
    }, [])

  return (
    <Form
        name='update-person-form'
        layout='inline'
        form={form}
        onFinish={onFinish}
        initialValues={{
            firstName,
            lastName
        }}
    >
        <Form.Item
            name='firstName'
            rules={[ {required: true, message: 'Please enter a first name'} ]}
        >
            <Input placeholder='First Name' />
        </Form.Item>

        <Form.Item
            name='lastName'
            rules={[ {required: true, message: 'Please enter a last name'} ]}
        >
            <Input placeholder='Last Name' />
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

export default UpdatePerson
