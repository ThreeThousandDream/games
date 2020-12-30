<template>
  <div class="elsfk">
    <div class="main">
      <div class="net">
        <div v-for="(line,o) in net" :key="o" class="line">
          <div
            :class="['grid',g.done?'done':'']"
            v-for="(g,i) in line"
            :key="i"
            :style="{'background-color':g.color}"
          ></div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="waiting">
        <div class="title">next</div>
        <div class="shape">
          <div v-for="(line,o) in nextImg" :key="o" class="line">
            <div
              :class="['grid',g.done?'done':'']"
              v-for="(g,i) in line"
              :key="i"
              :style="{'background-color':g.color}"
            ></div>
          </div>
        </div>
      </div>
      <div class="waiting">
        <div class="title">second</div>
        <div class="shape">
          <div v-for="(line,o) in secondImg" :key="o" class="line">
            <div
              :class="['grid',g.done?'done':'']"
              v-for="(g,i) in line"
              :key="i"
              :style="{'background-color':g.color}"
            ></div>
          </div>
        </div>
      </div>
      <div class="opt">
        <div class="left" @click="goLeft">
          <div class="triangle"></div>
        </div>
        <div class="right" @click="goRight">
          <div class="triangle"></div>
        </div>
        <div class="top" @click="goTop">
          <div class="triangle"></div>
        </div>
        <div class="bottom" @click="goBottom">
          <div class="triangle"></div>
        </div>
      </div>
      <div class="tips" @click="add">下一个</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "elsfk",
  data() {
    return {
      net: [],
      now: [],
      next: [],
      nextImg: [],
      second: [],
      secondImg: [],
      moveTask: null
    };
  },
  methods: {
    // 获得模块
    getMod(num) {
      switch (num) {
        case 1:
          return {
            color: "#00f0f0",
            pos: [
              [0, 1],
              [1, 1],
              [2, 1],
              [3, 1]
            ]
          };
        case 2:
          return {
            color: "#0000f0",
            pos: [
              [0, 1],
              [0, 2],
              [1, 1],
              [2, 1]
            ]
          };
        case 3:
          return {
            color: "#f0a000",
            pos: [
              [0, 0],
              [0, 1],
              [1, 1],
              [2, 1]
            ]
          };
        case 4:
          return {
            color: "#f0f000",
            pos: [
              [1, 0],
              [1, 1],
              [2, 0],
              [2, 1]
            ]
          };
        case 5:
          return {
            color: "#00f000",
            pos: [
              [0, 0],
              [1, 0],
              [1, 1],
              [2, 1]
            ]
          };
        case 6:
          return {
            color: "#a000f0",
            pos: [
              [1, 1],
              [2, 0],
              [2, 1],
              [2, 2]
            ]
          };
        case 7:
          return {
            color: "#f00000",
            pos: [
              [0, 1],
              [1, 0],
              [1, 1],
              [2, 0]
            ]
          };
      }
    },
    drawImg(nextMod) {
      let next = new Array(4);
      for (let i = 0; i < 4; i++) {
        let line = new Array(3);
        for (let j = 0; j < 3; j++) line[j] = { color: "#fff", done: false };
        next[i] = line;
      }
      return nextMod.pos.reduce((res, i) => {
        res[i[0]][i[1]] = { color: nextMod.color, done: false };
        return res;
      }, next);
    },
    refresh(pos) {
      this.now.pos.forEach(
        item => (this.net[(item[0], item[1])].color = "#fff")
      );
      this.now.pos = pos;
      pos.forEach(
        item =>
          (this.net[item[0]][item[1]] = {
            color: this.now.color,
            done: false
          })
      );
    },
    add() {
      this.now = this.next;
      let pos = this.now.pos.map(item => [item[0], item[1] + 4]);
      if (this.check(pos)) {
        this.refresh(pos);
        this.next = this.second;
        this.nextImg = this.secondImg;
        let second = this.getMod(Math.floor(Math.random() * 7 + 1));
        this.second = second;
        this.secondImg = this.drawImg(second);
      }
    },
    check(pos) {
      return pos.every(item => this.net[item[0]][item[1]].color == "#fff");
    },
    goLeft() {
      if (this.now.pos.find(item => item[0] <= 0)) {
        console.log('ret')
        return;
      }
      let pos = this.now.pos.map(item => [item[0] - 1, item[1]]);
      if (this.check(pos)) {
        this.refresh(pos);
      }
    },
    goRight() {},
    goTop() {},
    goBottom() {},
    move() {}
  },
  created() {
    this.net = new Array(20);
    for (let i = 0; i < 20; i++) {
      let line = new Array(10);
      for (let j = 0; j < 10; j++) line[j] = { color: "#fff", done: false };
      this.net[i] = line;
    }
    let next = this.getMod(Math.floor(Math.random() * 7 + 1));
    this.next = next;
    this.nextImg = this.drawImg(next);
    let second = this.getMod(Math.floor(Math.random() * 7 + 1));
    this.second = second;
    this.secondImg = this.drawImg(second);
    this.moveTask = setInterval(this.move, 800);
  }
};
</script>

<style lang="scss">
.elsfk {
  display: flex;
  padding: 0.1rem;
  justify-content: space-around;
  align-items: center;
  .net {
    border: 0.01rem solid #ccc;
    font-size: 0;
  }
  .grid {
    position: relative;
    display: inline-block;
    width: 0.2rem;
    height: 0.2rem;
    box-sizing: border-box;
    border: 0.01rem solid #ccc;
    &.done::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.7);
    }
  }
  .main {
    flex: 3;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.1rem;
    .waiting {
      height: 1rem;
      margin-top: 0.1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .title {
        height: 0.15rem;
        text-align: center;
        font-size: 0.14rem;
        line-height: 0.15rem;
      }
      .shape {
        border: 0.01rem solid #ccc;
        font-size: 0;
      }
    }
    .opt {
      position: relative;
      width: 0.6rem;
      height: 0.6rem;
      margin-top: 0.2rem;
      margin-bottom: 0.1rem;
      & > div {
        height: 0.2rem;
        width: 0.2rem;
        position: absolute;
        .triangle {
          width: 100%;
          height: 100%;
          background-color: skyblue;
        }
      }
      .top {
        left: 0.2rem;
        top: 0;
        .triangle {
          clip-path: polygon(50% 0, 100% 80%, 0 80%);
        }
      }
      .bottom {
        left: 0.2rem;
        top: 0.4rem;
        .triangle {
          clip-path: polygon(0 20%, 100% 20%, 50% 100%);
        }
      }
      .left {
        left: 0;
        top: 0.2rem;
        .triangle {
          clip-path: polygon(0 50%, 80% 0, 80% 100%);
        }
      }
      .right {
        left: 0.4rem;
        top: 0.2rem;
        .triangle {
          clip-path: polygon(20% 0, 100% 50%, 20% 100%);
        }
      }
    }
  }
}
</style>
