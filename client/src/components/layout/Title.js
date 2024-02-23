import React from 'react'
import { Divider } from 'antd';

const Title = (props) => {
    const { text } = props
  return (
    <Divider>{text}</Divider>
  )
}

export default Title
