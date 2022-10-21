<template>
    <div class="logout" @click="handleLogout">退出登陆</div>
</template>

<script>
import { useRouter } from 'vue-router'
export default{
    name:'HomeView',
    setup() {
    const router = useRouter()
    const handleLogout = () => {
        localStorage.removeItem('isLogin')
        router.replace({ name: 'LoginView'})
    }
    return { handleLogout }
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/viriables.scss';
.logout {
    margin: .4rem .7rem;
    line-height: .32rem;
    background: $btn-bgColor;
    color: $bgColor;
    text-align: center;
    border-radius: .04rem;
}
</style>
