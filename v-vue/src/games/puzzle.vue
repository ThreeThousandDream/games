<template>
  <div class="puzzle">
    <div class="panel">
      <div class="full" :style="{'background-image':url}"></div>
      <div class="right">
        <div class="btn-box">
          <div class="btn shuffle" @click="shuffle">打乱</div>
          <div class="btn" :class="{active:level===3}" @click="selectLevel(3)">简单</div>
          <div class="btn" :class="{active:level===4}" @click="selectLevel(4)">普通</div>
          <div class="btn" :class="{active:level===5}" @click="selectLevel(5)">困难</div>
        </div>
        <div class="desc">复制图片地址：</div>
        <input class="url" v-model="nowUrl"/>
        <div class="desc warn" v-show="!isTrue">图片地址无效，已切换回默认图片</div>
      </div>
    </div>
    <transition-group name="list" class="net" tag="div" @touchstart.native="touchStartHandle" @touchend.native="touchEndHandle">
      <div
              class="grid"
              v-for="item of list"
              :key="item"
              :class="{block:item===level*level}"
              :style="{'background-position':getPosition(item-1),'height':wh,'width':wh,'background-image':url}"
      ></div>
    </transition-group>
  </div>
</template>

<script>
  export default {
    name: 'puzzle',
    data() {
      return {
        net: [],// 用于计算的二维数组
        pos: [],// 记录白格子坐标
        list: [],// 实际使用的数组
        level: 3,// 游戏难度 3x3 4x4 5x5
        step: 1,// 根据困难度level计算出的小格子尺寸，单位rem
        defaultImg: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1579007493454&di=d58b02e6c2c38fb1183244120108a21c&imgtype=0&src=http%3A%2F%2Ffile02.16sucai.com%2Fd%2Ffile%2F2014%2F0829%2F372edfeb74c3119b666237bd4af92be5.jpg",// 默认url，容错
        img: '',// 实际使用的url
        nowUrl: '',// 输入框中url
        canMove: true,// 是否可以移动（游戏通关则禁止移动，等待互动结果）
        isTrue: true,// 提示信息是否显示
        touchStart: {x: 0, y: 0},// 记录滑动前接触坐标
        ifTouch: false
      }
    },
    computed: {
      wh() {
        return this.step + 'rem';
      },
      url() {
        return `url('${this.img}')`;
      }
    },
    watch: {
      nowUrl(url) {
        this.judge(url);
      }
    },
    methods: {
      // 滑动开始，记录接触点坐标
      touchStartHandle(e) {
        let {clientX, clientY} = e.touches[0];
        this.touchStart.x = clientX;
        this.touchStart.y = clientY;
        this.ifTouch = true;
      },
      // 滑动结束，比较开始和结束坐标，来决定移动方向
      touchEndHandle(e) {
        if (!this.ifTouch)
          return;
        let {clientX, clientY} = e.changedTouches[0];
        let {x, y} = this.touchStart;
        let goX = Math.abs(clientX - x), goY = Math.abs(clientY - y);
        if (goX > goY) {
          this.moveX(clientX > x);
        } else {
          this.moveY(clientY > y);
        }
        this.ifTouch = false;
      },
      // 监听url变化，判断图片是否合法，并做防抖处理
      judge: (function () {
        let task = null;
        return function (url) {
          let context = this;
          if (task !== null)
            clearTimeout(task);
          task = setTimeout(() => {
            if (!url) {
              context.img = context.defaultImg;
              context.isTrue = true;
              return
            }
            let ImgObj = new Image();
            ImgObj.src = url;
            ImgObj.onload = () => {
              context.img = url;
              context.isTrue = true;
            };
            ImgObj.onerror = () => {
              context.img = context.defaultImg;
              context.isTrue = false;
            };
            task = null;
          }, 200);
        }
      })(),
      // 选择游戏难度
      selectLevel(n) {
        this.level = n;
        this.pos = [n - 1, n - 1];
        this.step = 3 / n;
        this.net = [];
        let nn = n * n, i, x, y;
        for (i = 0; i < nn; i++) {
          x = Math.floor(i / n);
          y = i % n;
          this.net[x] = this.net[x] || [];
          this.net[x][y] = i + 1;
        }
        this.shuffle();
      },
      // 根据格子下标计算背景图位置
      getPosition(a) {
        let {level, step} = this;
        return `${-(a % level * step)}rem ${-(Math.floor(a / level) * step)}rem`;
      },
      // 判断游戏输赢，询问是否继续
      isWin() {
        let flag = 0, res = this.level * this.level;
        this.list.forEach((item, index) => flag += item === index + 1 ? 1 : 0);
        if (flag === res) {
          this.canMove = false;
          setTimeout(() => {
            if (confirm('你赢了!\n再来一局?')) {
              this.selectLevel(this.level);
              this.canMove = true;
            }
          }, 300);
        }
      },
      // 打乱
      shuffle() {
        this.canMove = true;
        let a;
        for (let i = 0; i < 100; i++) {
          a = Math.floor(Math.random() * 4);
          switch (a) {
            case 0:
              this.moveX(false, true);
              break;
            case 1:
              this.moveX(true, true);
              break;
            case 2:
              this.moveY(false, true);
              break;
            case 3:
              this.moveY(true, true);
              break;
          }
        }
        this.list = this.net.flat();
      },
      // 横向移动
      moveX(flag, flush) {
        if (!this.canMove)
          return;
        let x = this.pos[0], y = this.pos[1], to = flag ? y - 1 : y + 1;
        if ((y === 0 && flag) || (!flag && y === this.level - 1))
          return;
        let temp = this.net[x][y];
        this.net[x][y] = this.net[x][to];
        this.net[x][to] = temp;
        this.pos[1] = to;
        if (!flush) {
          this.list = this.net.flat();
          this.isWin();
        }
      },
      // 纵向移动
      moveY(flag, flush) {
        if (!this.canMove)
          return;
        let x = this.pos[0], y = this.pos[1], to = flag ? x - 1 : x + 1;
        if ((x === 0 && flag) || (!flag && x === this.level - 1))
          return;
        let temp = this.net[x][y];
        this.net[x][y] = this.net[to][y];
        this.net[to][y] = temp;
        this.pos[0] = to;
        if (!flush) {
          this.list = this.net.flat();
          this.isWin();
        }
      }
    },
    created() {
      this.img = this.defaultImg;
      this.selectLevel(3);
    }
  }
</script>

<style lang="scss">
  .puzzle {
    .list-move {
      transition: all .2s ease-in-out;
    }
    .panel {
      display: flex;
      height: 2rem;
      padding: .2rem .1rem 0;
      .full {
        flex: 0 0 2rem;
        height: 2rem;
        background-size: 2rem 2rem;
        background-repeat: no-repeat;
      }
      .right {
        flex: 1;
        padding: .1rem;
        .btn-box {
          .btn {
            height: .2rem;
            line-height: .2rem;
            font-size: .14rem;
            color: #aaa;
            text-align: center;
            transition: all .3s;
            &.shuffle {
              font-size: .16rem;
              margin-bottom: .05rem;
            }
            &.active {
              color: rgb(0, 160, 220);
            }
          }
        }
        .desc {
          line-height: .2rem;
          text-indent: .1rem;
          font-size: .12rem;
          &.warn {
            color: rgb(240, 20, 0);
            box-sizing: border-box;
            padding: 0 .1rem;
          }
        }
        .url {
          border: .02rem solid #ddd;
          width: 100%;
        }
      }
    }
    .net {
      width: 3rem;
      height: 3rem;
      margin: .2rem auto 0;
      font-size: 0;
      overflow: hidden;
      .grid {
        display: inline-block;
        background-repeat: no-repeat;
        background-size: 3rem 3rem;
        overflow: hidden;
        &.block {
          opacity: 0;
        }
      }
    }
  }
</style>
