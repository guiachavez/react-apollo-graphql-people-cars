import { Card } from 'antd'
import React, { useState, useEffect } from 'react'
import { EditOutlined } from '@ant-design/icons'
import UpdateCar from '../forms/UpdateCar'
import RemoveCar from '../buttons/RemoveCar'

const CarCard = (props) => {
    const { id, year, make, model, price, personId} = props
    const styles = getStyles()
    const [editMode, setEditMode] = useState(false)

    const editButtonClick = () => {
        setEditMode(!editMode)
    }

    return (
        <div style={styles.container}>
          { editMode ? 
            <UpdateCar 
              id={id} 
              year={year} 
              make={make} 
              model={model} 
              price={price} 
              personId={personId}
              onButtonClick={editButtonClick}/>
          : (
              <Card
                type='inner'
                actions={[
                  <EditOutlined key='edit' onClick={editButtonClick} />,
                  <RemoveCar id={id}/>
                ]}

                title={`${year} ${make} ${model} ${price}`}
              />
            )
          }
        </div>
    )
}

export default CarCard

const getStyles = () => ({
  container: {
    marginBottom: '1rem'
  }
}) 
