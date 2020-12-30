import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtNavBar } from 'taro-ui';

class Header extends Component {
  onLeft() {
    let { onLeft } = this.props
    onLeft ? onLeft() : Taro.navigateBack()
  }
  onRight() {
    let { onRight } = this.props
    onRight && onRight()
  }
  render() {
    let { title, leftIcon, rightIcon, nofixed } = this.props
    return (
      <View className='header'>
        <AtNavBar
          border={false}
          title={title}
          fixed={!nofixed}
          leftIconType={leftIcon || 'chevron-left'}
          onClickLeftIcon={this.onLeft.bind(this)}
          rightFirstIconType={rightIcon}
          onClickRgIconSt={this.onRight.bind(this)}
        />
      </View>
    )
  }
}
export default Header