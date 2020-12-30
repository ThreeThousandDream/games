import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
// import { connect } from '@tarojs/redux'

import Header from '../../components/header/header';
import './index.scss'

class Index extends Component {
  goGame = page => {
    Taro.navigateTo({
      url: '/pages/' + page + '/' + page
    })
  }
  componentWillUnmount() { }
  componentDidShow() { }
  componentDidHide() { }
  render() {
    return (
      <View className='index panel'>
        <Header title='什么乱七八糟的小游戏' leftIcon='1' />
        <View className='btn-box'>
          <Button onClick={() => this.goGame('g2048')}>2048</Button>
          <Button onClick={() => this.goGame('puzzle')}>拼图</Button>
          <Button onClick={() => this.goGame('sweep')}>扫雷</Button>
        </View>
      </View>
    )
  }
}
export default Index
