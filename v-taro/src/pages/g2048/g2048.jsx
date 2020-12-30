import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtToast } from 'taro-ui';

import Header from '../../components/header/header';
import { updateG2048 } from '../../actions';
import LinkedStack from '../../util/LinkedStack';
import './g2048.scss'

class G2048 extends Component {
  state = this.props.data
  constructor(props) {
    super(props)
    if (!this.state.isInit)
      this.init()
  }
  // 初始化&重新开始
  init = () => {
    let net = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    for (let i = 0; i < 7; i++)
      this.addNumber(net)
    let list = net.flat()
    let backList = new LinkedStack(7)
    this.setState({
      list, backList, net,
      die: false,
      ifTouch: false,
      isInit: false,
      oldList: [],
      touchStart: { x: 0, y: 0 },
      isInit: true,
    })
  }
  // 随机填充一个空白
  addNumber = net => {
    let x = Math.floor(Math.random() * 4)
    let y = Math.floor(Math.random() * 4)
    while (net[x][y] !== 0) {
      x = Math.floor(Math.random() * 4)
      y = Math.floor(Math.random() * 4)
    }
    net[x][y] = 2
  }
  // 根据数字计算出背景色
  getColor = number => {
    switch (number) {
      case 2:
        return "rgb(238, 228, 218)"
      case 4:
        return "rgb(237, 224, 200)"
      case 8:
        return "rgb(242, 177, 121)"
      case 16:
        return "rgb(245, 149, 99)"
      case 32:
        return "rgb(246, 124, 95)"
      case 64:
        return "rgb(246, 94, 59)"
      case 128:
        return "rgb(237, 207, 114)"
      case 256:
        return "rgb(237, 204, 97)"
      case 512:
        return "rgb(237, 200, 80)"
      case 1024:
        return "rgb(237, 197, 63)"
      case 2048:
        return "rgb(237, 194, 46)"
      default:
        return "rgb(220, 220, 220)"
    }
  }
  // 滑动开始，记录开始坐标
  touchStartHandle = e => {
    let { die, touchStart } = this.state
    if (die)
      return
    let { clientX, clientY } = e.touches[0]
    touchStart.x = clientX
    touchStart.y = clientY
    let ifTouch = true
    this.setState({ touchStart, ifTouch })
  }
  // 滑动结束，比较开始和结束坐标，来决定移动方向
  touchEndHandle = e => {
    let { ifTouch, die, touchStart, net, oldList, backList, list } = this.state
    if (!ifTouch)
      return
    if (die)
      return console.log("你已经输了弟弟")
    let
      { clientX, clientY } = e.changedTouches[0],
      { x, y } = touchStart,
      goX = Math.abs(clientX - x),
      goY = Math.abs(clientY - y),
      moved = false,
      oldNet = [[...net[0]], [...net[1]], [...net[2]], [...net[3]]]
    if (goX > goY) {
      if (clientX > x)
        moved = this.moveRight()
      else
        moved = this.moveLeft()
    } else {
      if (clientY > y)
        moved = this.moveBottom()
      else
        moved = this.moveTop()
    }
    ifTouch = false
    if (moved) {
      oldList = oldNet.flat()
      backList.send(oldNet)
      this.addNumber(net)
      list = net.flat()
    }
    if (!(this.canLeft() || this.canRight() || this.canTop() || this.canBottom())) {
      die = true
    }
    this.setState({ die, ifTouch, oldList, backList, list })
  }
  // 回退一步
  goBack = () => {
    let { backList, net, list, die } = this.state
    let lastNet = backList.pop()
    if (lastNet) {
      net = lastNet
      list = lastNet.flat()
      die = false
    }
    this.setState({ backList, net, list, die })
  }
  canLeft = () => {
    let { net } = this.state
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 3; j++)
        if (
          (net[i][j] === 0 && net[i][j + 1] !== 0) ||
          (net[i][j] === net[i][j + 1] && net[i][j] !== 0)
        )
          return true
    return false
  }
  canRight = () => {
    let { net } = this.state
    for (let i = 0; i < 4; i++)
      for (let j = 3; j > 0; j--)
        if (
          (net[i][j] === 0 && net[i][j - 1] !== 0) ||
          (net[i][j] === net[i][j - 1] && net[i][j] !== 0)
        )
          return true
    return false
  }
  canTop = () => {
    let { net } = this.state
    for (let j = 0; j < 4; j++)
      for (let i = 0; i < 3; i++)
        if (
          (net[i][j] === 0 && net[i + 1][j] !== 0) ||
          (net[i][j] === net[i + 1][j] && net[i][j] !== 0)
        )
          return true
    return false
  }
  canBottom = () => {
    let { net } = this.state
    for (let j = 0; j < 4; j++)
      for (let i = 3; i > 0; i--)
        if (
          (net[i][j] === 0 && net[i - 1][j] !== 0) ||
          (net[i][j] === net[i - 1][j] && net[i][j] !== 0)
        )
          return true
    return false
  }
  moveLeft = () => {
    if (!this.canLeft())
      return false
    let { net, list } = this.state
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (net[i][j] === 0)
          continue
        for (let p = j + 1; p < 4; p++) {
          if (net[i][p] === 0)
            continue
          if (net[i][j] === net[i][p]) {
            net[i][j] *= 2
            net[i][p] = 0
          }
          break
        }
      }
      let newArr = [0, 0, 0, 0]
      for (let j = 0, p = 0; j < 4; j++)
        if (net[i][j] !== 0)
          newArr[p++] = net[i][j]
      net[i] = newArr
    }
    list = net.flat()
    this.setState({ net, list })
    return true
  }
  moveRight = () => {
    if (!this.canRight())
      return false
    let { net, list } = this.state
    for (let i = 0; i < 4; i++) {
      for (let j = 3; j > 0; j--) {
        if (net[i][j] === 0)
          continue
        for (let p = j - 1; p >= 0; p--) {
          if (net[i][p] === 0)
            continue
          if (net[i][j] === net[i][p]) {
            net[i][j] *= 2
            net[i][p] = 0
          }
          break
        }
      }
      let newArr = [0, 0, 0, 0]
      for (let j = 3, p = 3; j >= 0; j--)
        if (net[i][j] !== 0)
          newArr[p--] = net[i][j]
      net[i] = newArr
    }
    list = net.flat()
    this.setState({ net, list })
    return true
  }
  moveTop = () => {
    if (!this.canTop())
      return false
    let { net, list } = this.state
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 3; i++) {
        if (net[i][j] === 0)
          continue
        for (let p = i + 1; p < 4; p++) {
          if (net[p][j] === 0)
            continue
          if (net[i][j] === net[p][j]) {
            net[i][j] *= 2
            net[p][j] = 0
          }
          break
        }
      }
      let newArr = [0, 0, 0, 0];
      for (let i = 0, p = 0; i < 4; i++)
        if (net[i][j] !== 0)
          newArr[p++] = net[i][j]
      for (let i = 0; i < 4; i++)
        net[i][j] = newArr[i]
    }
    list = net.flat()
    this.setState({ net, list })
    return true
  }
  moveBottom = () => {
    if (!this.canBottom())
      return false
    let { net, list } = this.state
    for (let j = 0; j < 4; j++) {
      for (let i = 3; i > 0; i--) {
        if (net[i][j] === 0)
          continue
        for (let p = i - 1; p >= 0; p--) {
          if (net[p][j] === 0)
            continue
          if (net[i][j] === net[p][j]) {
            net[i][j] *= 2
            net[p][j] = 0
          }
          break
        }
      }
      let newArr = [0, 0, 0, 0]
      for (let i = 3, p = 3; i >= 0; i--)
        if (net[i][j] !== 0)
          newArr[p--] = net[i][j]
      for (let i = 0; i < 4; i++)
        net[i][j] = newArr[i]
    }
    list = net.flat()
    this.setState({ net, list })
    return true
  }
  componentWillUnmount() {
    this.props.update({ ...this.state, isInit: true })
  }
  render() {
    let
      { die, list, backList } = this.state,
      canBack = backList && backList.length > 0
    return (
      <View className='g2048 panel'>
        <Header title='2048' />
        <AtToast text='你已经无路可走' icon='blocked' isOpened={die} duration={1500} />
        <View
          className={die ? "btn restart active" : "btn restart"}
          onClick={this.init}
          style={{ color: die ? '#2ecc71' : '#999' }}
        >重新开始</View>
        <View className="net" onTouchStart={this.touchStartHandle} onTouchEnd={this.touchEndHandle}>
          {list && list.map((item, index) => (<View
            key={index + '?'}
            className={item === 0 ? 'grid blank' : 'grid'}
            style={{ backgroundColor: this.getColor(item) }}
          >{item}</View>))}
        </View>
        <View
          onClick={this.goBack}
          className={canBack ? 'btn back active' : 'btn back'}
          style={{ color: canBack ? '#2ecc71' : '#ccc' }}
        >回退</View>
      </View >
    )
  }
}
export default connect(
  ({ g2048 }) => ({ data: g2048 }),
  { update: updateG2048 }
)(G2048)
