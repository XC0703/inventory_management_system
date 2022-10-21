import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
{
    path:'/',
    name:'Home',
    // 异步组件，只有访问的时候才加载,"home"指的是代码包的名字
    component:()=>import(/* webpackChunName:"home" */ '../views/home/HomeView')
},
{
    path:'/login',
    name:'LoginView',
    component:()=>import(/* webpackChunName:"login" */ '../views/login/LoginView'),
    // 只有访问LoginView这个页面之前才会执行,作用是登录之后无法访问LoginView页面
    beforeEnter(to,from,next){
        const {isLogin} = localStorage;//解构赋值，相当于const isLogin = localStorage.isLogin
        // 如果已经登录，则跳转到Home页面，否则正常展示当前页面
        isLogin ? next({name:'Home'}): next();
    }
},
{
    path:'/register',
    name:'RegisterView',
    component:()=>import(/* webpackChunName:"register" */ '../views/register/RegisterView'),
    // 只有访问LoginView这个页面之前才会执行,作用是登录之后无法访问LoginView页面
    beforeEnter(to,from,next){
        const {isLogin} = localStorage;//解构赋值，相当于const isLogin = localStorage.isLogin
        // 如果已经登录，则跳转到Home页面，否则正常展示当前页面
        isLogin ? next({name:'Home'}): next();
    }
},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由守卫实现基础登陆校验功能
// beforeEach表示在初始化时候被调用和每次路由切换之前别调用
router.beforeEach((to,from,next)=>{
    // isLogin在本地存储中
    const isLogin = localStorage.isLogin;

    //to：进入到哪个路由去
    //from：从哪个路由离开
    //next：路由的控制参数，常用的有next(true)和next(false)

    // 用户没有登录或者当前不是注册页面的时候，无法访问其它页面，只能跳到LoginView页面
    //其它情况则展示当前页面
    if(!isLogin&&(to.name !=='LoginView'&&to.name !=='RegisterView')){
        next({name:'LoginView'})
    }else{
        next()
    }
})

export default router
