import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
// import { connect } from '@tarojs/redux'

import './sweep.scss'

class Sweep extends Component {

  render () {
    return (
      <View className='sweep'>
        <View><Text>扫雷</Text></View>
      </View>
    )
  }
}

export default Sweep
