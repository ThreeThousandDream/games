<template>
  <div class="wey2048">
    <div class="tips" v-show="die">你已经无路可走</div>
    <div class="restart" @click="init">重新开始</div>
    <div class="net" @touchstart="touchStartHandle" @touchend="touchEndHandle">
      <div
              class="grid"
              v-for="(item,index) of list"
              :key="index"
              :class="{blank:item===0}"
              :style="{'background-color':getColor(item),'animation-name':scaleList[index]}"
      >{{item}}
      </div>
    </div>
    <div class="back" @click="goBack" :class="{active:backList&&backList.length>0}">回退</div>
  </div>
</template>

<script>
  const LinkedStack = require("../assets/js/LinkedStack.js");
  export default {
    name: "wey2048",
    data() {
      return {
        net: [],
        list: [],
        oldList: [],
        touchStart: {x: 0, y: 0}, // 记录滑动前接触坐标
        ifTouch: false,
        die: false,
        backList: null,
        scaleList: null
      };
    },
    methods: {
      setScale() {
        let {list, oldList, scaleList} = this;
        for (let i = 0; i < 16; i++) {
          if (list[i] === 0) {
            scaleList[i] = '';
            continue;
          }
          if (list[i] > oldList[i]) {
            if (scaleList[i] === 'scale')
              scaleList[i] = 'scale2';
            else
              scaleList[i] = 'scale';
          }
        }
      },
      // 随机填充一个空白
      addNumber() {
        let x = Math.floor(Math.random() * 4);
        let y = Math.floor(Math.random() * 4);
        while (this.net[x][y] !== 0) {
          x = Math.floor(Math.random() * 4);
          y = Math.floor(Math.random() * 4);
        }
        this.net[x][y] = 2;
      },
      // 重新开始
      init() {
        this.net = [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        for (let i = 0; i < 7; i++) this.addNumber();
        this.list = this.net.flat();
        this.die = false;
        this.backList = new LinkedStack(7);
        this.scaleList = new Array(16).fill('');
      },
      // 根据数字计算出背景色
      getColor(number) {
        switch (number) {
          case 2:
            return "rgb(238, 228, 218)";
          case 4:
            return "rgb(237, 224, 200)";
          case 8:
            return "rgb(242, 177, 121)";
          case 16:
            return "rgb(245, 149, 99)";
          case 32:
            return "rgb(246, 124, 95)";
          case 64:
            return "rgb(246, 94, 59)";
          case 128:
            return "rgb(237, 207, 114)";
          case 256:
            return "rgb(237, 204, 97)";
          case 512:
            return "rgb(237, 200, 80)";
          case 1024:
            return "rgb(237, 197, 63)";
          case 2048:
            return "rgb(237, 194, 46)";
          default:
            return "rgb(220, 220, 220)";
        }
      },
      // 滑动开始，记录开始坐标
      touchStartHandle(e) {
        if (this.die) return;
        let {clientX, clientY} = e.touches[0];
        this.touchStart.x = clientX;
        this.touchStart.y = clientY;
        this.ifTouch = true;
      },
      // 滑动结束，比较开始和结束坐标，来决定移动方向
      touchEndHandle(e) {
        if (!this.ifTouch) return;
        if (this.die) return console.log("你已经输了弟弟");
        let {clientX, clientY} = e.changedTouches[0],
          {x, y} = this.touchStart,
          goX = Math.abs(clientX - x),
          goY = Math.abs(clientY - y),
          moved = false,
          {net} = this,
          oldNet = [[...net[0]], [...net[1]], [...net[2]], [...net[3]]];
        if (goX > goY) {
          if (clientX > x) moved = this.moveRight();
          else moved = this.moveLeft();
        } else {
          if (clientY > y) moved = this.moveBottom();
          else moved = this.moveTop();
        }
        this.ifTouch = false;
        if (moved) {
          this.oldList = oldNet.flat();
          this.backList.send(oldNet);
          this.addNumber();
          this.list = this.net.flat();
          this.setScale();
        }
        if (
          !(
            this.canLeft() ||
            this.canRight() ||
            this.canTop() ||
            this.canBottom()
          )
        ) {
          this.die = true;
          console.log("你已经输了弟弟");
        }
      },
      // 回退一步
      goBack() {
        let lastNet = this.backList.pop();
        if (lastNet) {
          this.net = lastNet;
          this.list = lastNet.flat();
          this.die = false;
        }
      },
      canLeft() {
        let {net} = this;
        for (let i = 0; i < 4; i++)
          for (let j = 0; j < 3; j++)
            if (
              (net[i][j] === 0 && net[i][j + 1] !== 0) ||
              (net[i][j] === net[i][j + 1] && net[i][j] !== 0)
            )
              return true;
        return false;
      },
      canRight() {
        let {net} = this;
        for (let i = 0; i < 4; i++)
          for (let j = 3; j > 0; j--)
            if (
              (net[i][j] === 0 && net[i][j - 1] !== 0) ||
              (net[i][j] === net[i][j - 1] && net[i][j] !== 0)
            )
              return true;
        return false;
      },
      canTop() {
        let {net} = this;
        for (let j = 0; j < 4; j++)
          for (let i = 0; i < 3; i++)
            if (
              (net[i][j] === 0 && net[i + 1][j] !== 0) ||
              (net[i][j] === net[i + 1][j] && net[i][j] !== 0)
            )
              return true;
        return false;
      },
      canBottom() {
        let {net} = this;
        for (let j = 0; j < 4; j++)
          for (let i = 3; i > 0; i--)
            if (
              (net[i][j] === 0 && net[i - 1][j] !== 0) ||
              (net[i][j] === net[i - 1][j] && net[i][j] !== 0)
            )
              return true;
        return false;
      },
      moveLeft() {
        if (!this.canLeft()) return false;
        let {net} = this;
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 3; j++) {
            if (net[i][j] === 0) continue;
            for (let p = j + 1; p < 4; p++) {
              if (net[i][p] === 0) continue;
              if (net[i][j] === net[i][p]) {
                net[i][j] *= 2;
                net[i][p] = 0;
              }
              break;
            }
          }
          let newArr = [0, 0, 0, 0];
          for (let j = 0, p = 0; j < 4; j++)
            if (net[i][j] !== 0) newArr[p++] = net[i][j];
          net[i] = newArr;
        }
        this.list = this.net.flat();
        return true;
      },
      moveRight() {
        if (!this.canRight()) return false;
        let {net} = this;
        for (let i = 0; i < 4; i++) {
          for (let j = 3; j > 0; j--) {
            if (net[i][j] === 0) continue;
            for (let p = j - 1; p >= 0; p--) {
              if (net[i][p] === 0) continue;
              if (net[i][j] === net[i][p]) {
                net[i][j] *= 2;
                net[i][p] = 0;
              }
              break;
            }
          }
          let newArr = [0, 0, 0, 0];
          for (let j = 3, p = 3; j >= 0; j--)
            if (net[i][j] !== 0) newArr[p--] = net[i][j];
          net[i] = newArr;
        }
        this.list = this.net.flat();
        return true;
      },
      moveTop() {
        if (!this.canTop()) return false;
        let {net} = this;
        for (let j = 0; j < 4; j++) {
          for (let i = 0; i < 3; i++) {
            if (net[i][j] === 0) continue;
            for (let p = i + 1; p < 4; p++) {
              if (net[p][j] === 0) continue;
              if (net[i][j] === net[p][j]) {
                net[i][j] *= 2;
                net[p][j] = 0;
              }
              break;
            }
          }
          let newArr = [0, 0, 0, 0];
          for (let i = 0, p = 0; i < 4; i++)
            if (net[i][j] !== 0) newArr[p++] = net[i][j];
          for (let i = 0; i < 4; i++) net[i][j] = newArr[i];
        }
        this.list = this.net.flat();
        return true;
      },
      moveBottom() {
        if (!this.canBottom()) return false;
        let {net} = this;
        for (let j = 0; j < 4; j++) {
          for (let i = 3; i > 0; i--) {
            if (net[i][j] === 0) continue;
            for (let p = i - 1; p >= 0; p--) {
              if (net[p][j] === 0) continue;
              if (net[i][j] === net[p][j]) {
                net[i][j] *= 2;
                net[p][j] = 0;
              }
              break;
            }
          }
          let newArr = [0, 0, 0, 0];
          for (let i = 3, p = 3; i >= 0; i--)
            if (net[i][j] !== 0) newArr[p--] = net[i][j];
          for (let i = 0; i < 4; i++) net[i][j] = newArr[i];
        }
        this.list = this.net.flat();
        return true;
      }
    },
    created() {
      this.init();
    },
  };
</script>

<style lang="scss">
  .wey2048 {
    .tips {
      margin-top: 0.2rem;
      text-align: center;
      line-height: 0.24rem;
      font-size: 0.14rem;
      color: rgb(240, 20, 0);
    }
    .restart {
      width: 0.8rem;
      height: 0.3rem;
      text-align: center;
      line-height: 0.3rem;
      font-size: 0.16rem;
      margin: 0.1rem auto 0;
      border: 0.02rem solid #dddddd;
      border-radius: 0.05rem;
    }
    .net {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 2.8rem;
      height: 2.8rem;
      padding: 0.04rem;
      border-radius: 0.05rem;
      font-size: 0;
      background-color: #cccccc;
      .grid {
        display: inline-block;
        width: 0.62rem;
        height: 0.62rem;
        margin: 0.04rem;
        border-radius: 0.05rem;
        text-align: center;
        line-height: 0.62rem;
        font-size: 0.2rem;
        font-weight: 600;
        animation-duration: .3s;
        transition: background-color .3s;
        &.blank {
          color: transparent;
        }
      }
    }
    .back {
      position: absolute;
      left: 50%;
      bottom: 0.2rem;
      transform: translateX(-50%);
      width: 0.6rem;
      height: 0.3rem;
      text-align: center;
      line-height: 0.3rem;
      font-size: 0.16rem;
      color: #999999;
      border: 0.02rem solid #dddddd;
      border-radius: 0.05rem;
      &.active {
        transition: all .2s;
        color: rgb(0, 160, 220);
      }
    }
  }
</style>
