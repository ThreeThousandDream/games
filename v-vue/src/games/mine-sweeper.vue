<template>
  <div class="mine-sweeper">
    <div class="select">
      <input type="range" v-model="range" max="20" min="7"/>
      <span>{{range}}</span>
      <span class="reload" @click="selectLevel"/>
    </div>
    <div class="bombs">剩余雷数： {{bomb}}</div>
    <div class="net noselect">
      <div v-for="(out,o) of net" :key="o">
        <div
                class="grid"
                v-for="(item,index) of out"
                :key="index"
                :class="[item.cls]"
                :style="{color:setColor(item)}"
                @touchstart="handleTouchStart(item)"
                @touchend="handleTouchEnd(item)"
        >{{setHtml(item)}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "mine-sweeper",
    data() {
      return {
        net: [],
        range: 15,
        level: 0,
        bomb: 0,
        trueBomb: 0,
        blank: 0,
        touched: false,
        task: null,
        die: false,
        done: false
      };
    },
    methods: {
      // 选择游戏难度
      selectLevel() {
        if (this.die || this.level !== this.range)
          this.init();
      },
      // 初始化/重置游戏
      init() {
        this.die = false;
        this.done = false;
        this.level = this.range;
        this.bomb = Math.floor(this.level * 2);
        this.trueBomb = this.bomb;
        this.blank = this.level * 15;
        let newNet = [];
        for (let i = 0; i < this.level; i++) {
          newNet[i] = [];
          for (let j = 0; j < 15; j++) {
            newNet[i].push({cls: "mask", type: 0, pst: [i, j]});
          }
        }
        this.hideBomb(newNet);
        this.setNumber(newNet);
        this.net = newNet;
      },
      // 埋雷
      hideBomb(newNet) {
        let bombs = {},
          {bomb, level} = this,
          str,
          i = 0;
        while (i < bomb) {
          str =
            Math.floor(Math.random() * level) +
            "-" +
            Math.floor(Math.random() * 15);
          if (!bombs[str]) {
            bombs[str] = 1;
            i++;
          }
        }
        Object.keys(bombs).forEach(key => {
          let arr = key.split("-"),
            x = arr[0],
            y = arr[1];
          newNet[x][y].type = 1;
        });
      },
      // 设置雷周围数字
      setNumber(newNet) {
        for (let i = 0; i < this.level; i++) {
          for (let j = 0; j < 15; j++) {
            if (newNet[i][j].type === 0) {
              let num = 0;
              if (
                newNet[i - 1] &&
                newNet[i - 1][j - 1] &&
                newNet[i - 1][j - 1].type === 1
              )
                num++;
              if (newNet[i - 1] && newNet[i - 1][j].type === 1) num++;
              if (
                newNet[i - 1] &&
                newNet[i - 1][j + 1] &&
                newNet[i - 1][j + 1].type === 1
              )
                num++;
              if (newNet[i][j - 1] && newNet[i][j - 1].type === 1) num++;
              if (newNet[i][j + 1] && newNet[i][j + 1].type === 1) num++;
              if (
                newNet[i + 1] &&
                newNet[i + 1][j - 1] &&
                newNet[i + 1][j - 1].type === 1
              )
                num++;
              if (newNet[i + 1] && newNet[i + 1][j].type === 1) num++;
              if (
                newNet[i + 1] &&
                newNet[i + 1][j + 1] &&
                newNet[i + 1][j + 1].type === 1
              )
                num++;
              newNet[i][j].number = num === 0 ? "" : num;
              newNet[i][j].type = num === 0 ? 0 : 2;
            }
          }
        }
      },
      // 设置格子显示内容
      setHtml(item) {
        switch (item.type) {
          case 1:
            return "X";
          case 2:
            return item.number;
          default:
            return "";
        }
      },
      // 设置格子显示颜色
      setColor(item) {
        if (item.number) {
          switch (item.number) {
            case 1:
              return "#0000ff";
            case 2:
              return "#008100";
            case 3:
              return "#ff0000";
            case 4:
              return "#000081";
            case 5:
              return "#810000";
            case 6:
              return "#008181";
            case 7:
              return "#000000";
            case 8:
              return "#999999";
          }
        } else return "rgb(240,20,0)";
      },
      // 按下事件处理(长按模拟双击)
      handleTouchStart(item) {
        if (this.done)
          return;
        this.touched = true;
        this.task = setTimeout(() => {
          this.touched = false;
          if (item.cls === 'mask') {
            item.cls = 'flag';
            this.bomb--;
          } else if (item.cls === 'flag') {
            item.cls = 'mask';
            this.bomb++;
          }
        }, 500);
      },
      // 弹起事件处理(短按模拟单击)
      handleTouchEnd(item) {
        if (this.done)
          return;
        if (!this.touched) {
          return;
        } else {
          this.timeout = false;
          clearTimeout(this.task);
          if (this.die)
            return console.log('你死了');
          if (item.cls === 'flag')
            return;
          if (item.type === 1) {
            this.die = true;
            let {net} = this;
            for (let i = 0; i < this.level; i++)
              for (let j = 0; j < 15; j++) {
                let now = net[i][j];
                if (now.type === 1) {
                  now.cls = '';
                }
              }
            setTimeout(function () {
              console.log('你死了');
            }, 300);
          } else {
            this.empty(item.pst[0], item.pst[1]);
            if (this.blank === this.trueBomb) {
              this.done = true;
              setTimeout(() => {
                if (confirm('    6\n   666\n  66666\n 6666666\n666666666\n再来一局？'))
                  this.init();
              }, 300);
            }
          }
        }
      },
      // 递归掀开空块
      empty(i, j) {
        let {net} = this;
        let now = net[i] && net[i][j];
        if (!now || now.type === 1 || now.cls !== 'mask')
          return;
        now.cls = '';
        this.blank--;
        if (now.type === 0) {
          this.empty(i - 1, j - 1);
          this.empty(i - 1, j);
          this.empty(i - 1, j + 1);
          this.empty(i, j - 1);
          this.empty(i, j + 1);
          this.empty(i + 1, j - 1);
          this.empty(i + 1, j);
          this.empty(i + 1, j + 1);
        }
      }
    },
    created() {
      this.init();
    },
  };
</script>

<style lang="scss">
  .mine-sweeper {
    .select {
      margin: 0.1rem auto;
      height: 0.2rem;
      line-height: 0.2rem;
      text-align: center;
      span {
        margin-left: 0.1rem;
        vertical-align: top;
        &.reload {
          display: inline-block;
          height: .2rem;
          width: .2rem;
          background-size: cover;
          background-repeat: no-repeat;
          background-image: url("../assets/image/reload.png");
        }
      }
    }
    .bombs {
      height: .2rem;
      line-height: 0.2rem;
      text-align: center;
    }
    .net {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 3rem;
      padding: 0.01rem;
      border: 0.01rem solid #ccc;
      box-shadow: 0 0 0.1rem 0.03rem #ccc;
      line-height: 0.16rem;
      text-align: center;
      font-size: 0.14rem;
      font-weight: 600;
      background-color: #fff;
      .grid {
        float: left;
        position: relative;
        display: inline-block;
        margin: 0.01rem;
        width: 0.18rem;
        height: 0.18rem;
        box-sizing: border-box;
        border: 0.01rem solid #c1c1c1;
        &:before {
          content: "";
          position: absolute;
          left: -0.01rem;
          right: -0.01rem;
          bottom: -0.01rem;
          top: -0.01rem;
        }
        &.mask:before {
          background-color: #e2dfee;
        }
        &.flag:before {
          background-size: cover;
          background-repeat: no-repeat;
          background-image: url("../assets/image/flag.jpg");
        }
      }
    }
  }
</style>
