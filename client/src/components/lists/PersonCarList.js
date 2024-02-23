import React from 'react'
import { List } from 'antd'
import { useQuery } from '@apollo/client'
import { GET_PERSONS } from '../../graphql/queries'
import PersonCard from '../listItems/PersonCard'

const PersonCarList = () => {
    const styles = getStyles()
    const { loading, error, data } = useQuery(GET_PERSONS);

    if(loading) return'Loading...'
    if(error) return `Error ${error.message}`
    
    return (
        <div style={styles.container}>
        <List
            itemLayout='vertical'
            dataSource={data.persons}
            renderItem={({ id, firstName, lastName }) => (
                <List.Item key={id}>
                    <div className="list-header">
                        <PersonCard
                            key={id}
                            id={id}
                            firstName={firstName}
                            lastName={lastName}
                            displayAllCars={false}
                        />
                    </div>
                </List.Item>
            )}
        />
    </div>
    )
}

export default PersonCarList

const getStyles = () => ({
    container: {
        width: '90%',
        margin: 'auto'
    }
})
