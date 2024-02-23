import React from 'react'
import { Divider } from 'antd'

const Header = () => {
  const styles = getStyles()
  return (
    <div style={styles.container}><h1>People and their cars</h1><Divider /></div>
  )
}

export default Header

const getStyles = () => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  }
})
