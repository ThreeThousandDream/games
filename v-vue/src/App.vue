<template>
  <div id="app">
    <div class="links">
      <router-link tag="div" to="/puzzle" class="link">拼图</router-link>
      <router-link tag="div" to="/sweeper" class="link">扫雷</router-link>
      <router-link tag="div" to="/wey2048" class="link">2048</router-link>
      <router-link tag="div" to="/elsfk" class="link">俄罗斯方块</router-link>
    </div>
    <keep-alive>
      <router-view class="view"/>
    </keep-alive>
  </div>
</template>

<script>

  export default {
    name: 'app',
    components: {}
  }
</script>

<style lang="scss">
  .links {
    display: flex;
    padding-bottom: .1rem;
    .link {
      position: relative;
      flex: 1;
      height: .3rem;
      line-height: .3rem;
      text-align: center;
      transition: all .3s;
      &:before {
        content: '';
        position: absolute;
        height: .02rem;
        width: 60%;
        left: 20%;
        bottom: 0;
        transform: rotateY(90deg);
        transition: all .3s;
        background-color: skyblue;
      }
      &.router-link-active {
        color: skyblue;
        &:before {
          transform: rotateY(0);
        }
      }
    }
  }
  .view {
    position: fixed;
    top: .4rem;
    bottom: 0;
    left: 0;
    right: 0;
    box-sizing: border-box;
  }
</style>
