<template>
  <el-container class="index-con">
    <el-aside :class="showclass">
      <LeftNav></LeftNav>
    </el-aside>
    <el-container class="main-con">
      <el-header class="index-topNav">
        <TopNav></TopNav>
      </el-header>
      <!-- 设置组件跟随路由变化而变化 -->
      <el-main class="index-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// 导入组件
import TopNav from '../../components/TopNav.vue'
import LeftNav from '../../components/LeftNav.vue'
export default {
  name: 'IndexView',
  components: { TopNav,LeftNav },
  data() {
    return {
      showclass: 'asideshow',
      showtype: false
    }
  },
  created() {
    // 监听切换显示
    this.$bus.on('toggle', value => {
      if (value) {
        this.showclass = 'asideshow'
      } else {
        setTimeout(() => {
          this.showclass = 'aside'
        }, 300)
      }
    })
  },
}
</script>
<style lang="scss" scoped>
.index-con {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.aside {
  width: 0.64rem !important;
  height: 100%;
  background-color: #334157;
  margin: 0;
}
.asideshow {
  width: 2rem !important;
  height: 100%;
  background-color: #334157;
  margin: 0;
}
.index-topNav,
.index-main {
  padding: 0;
  border-left: 0.02rem solid #293446;
  overflow: hidden;
}
</style>
