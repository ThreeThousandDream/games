import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
// import { connect } from '@tarojs/redux'

import './puzzle.scss'

class Puzzle extends Component {

  render () {
    return (
      <View className='puzzle'>
        <View><Text>拼图</Text></View>
      </View>
    )
  }
}

export default Puzzle
