<template>
<!-- 根据路由不同展示不同的组件 -->
<router-view />
</template>

<script>
export default {
  name: 'App',
  created() {
    if(this.$router.path !== '/'){
      this.$router.replace('/')
    }
  }
}
</script>

<style>
</style>
