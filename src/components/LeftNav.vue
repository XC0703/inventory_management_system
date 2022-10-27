<template>
  <el-menu router :default-active="this.$route.path?this.$route.path:miserware" :collapse="collapsed" collapse-transition unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logobox__logoimg" src="../assets/images/logo.png" alt="">
    </div>
    <el-menu-item v-for="chmenu in allmenu" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{chmenu.menuname}}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'LeftNav',
  data() {
    return {
      collapsed: false, //类似于v-model，表示这个element是可折叠的
      allmenu: []
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    let res = {
        success: true,
        data: [
          {
            menuid: 1,
            icon: 'icon-goods',
            menuname: '库存管理',
            url: 'miserware',
            menus: null
          },
          {
            menuid: 2,
            icon: 'icon-dingdanjihe',
            menuname: '订单管理',
            url: 'miserorder',
            menus: null
          },
          {
            menuid: 2,
            icon: 'icon-gouwuche',
            menuname: '临时订单',
            url: 'misercart',
            menus: null
          },
          {
            menuid: 3,
            icon: 'icon-yonghuguanli',
            menuname: '用户管理',
            url: 'miseruser',
            menus: null
          },
        ],
        msg: 'success'
    }
    this.allmenu = res.data,

    // 监听切换显示
    this.$bus.on('toggle', value => {
        this.collapsed = !value
    })
  },
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 2rem;
  min-height: 100vh;
  border:none;
}
.el-menu-vertical-demo.el-menu--collapse {
  border:none;
  text-align: left;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.iconfont{
  font-size: .18rem;
  margin-right: .1rem;
  color:#909399;
}
.logobox {
  height: 0.8rem;
  line-height: 0.8rem;
  color: #9d9d9d;
  text-align: center;
  padding: 0.2rem 0;
  &__logoimg {
    height: 0.4rem;
  }
}
</style>
