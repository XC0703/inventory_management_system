<template>
<div class="bgContainer">
  <div class="wrapper">
    <img class="wrapper__img" src='http://www.dell-lee.com/imgs/vue3/user.png' />
    <div class="wrapper__input">
      <input
        class="wrapper__input__content"
        placeholder="用户名"
        v-model="username"
      />
    </div>
    <!-- autocomplete="new-password"是为了防止自动填充密码 -->
    <div class="wrapper__input">
      <input
        type="password"
        class="wrapper__input__content"
        placeholder="请输入密码"
        v-model="password"
        autocomplete="new-password"
      />
    </div>
    <div class="wrapper__login-button" @click="handleLogin">登陆</div>
    <!-- 像这样通过router-link :to跳转，会在外层自动包裹一个a标签 -->
    <!-- <router-link :to="{name:'RegisterView'}">
      <div class="wrapper__login-link">立即注册</div>
    </router-link> -->
    <!-- 因此采取事件绑定的方式进行事件跳转 -->
    <div class="wrapper__login-link" @click="handleRegisterClick">立即注册</div>
    <!-- 将信息传给ToastView组件 -->
    <ToastView v-if="show" :message="toastMessage" />
  </div>
</div>
</template>

<script>
import {reactive, toRefs} from 'vue';
import { useRouter } from 'vue-router';
import {post} from '../../utils/request';
import ToastView,{useToastEffect} from '../../components/ToastView';

// 登录逻辑处理
const useLoginEffect = (showToast)=>{
    // 1--我们现在是用axios自带的post方法发起请求，要求后面的URL是完整的URL，不是后端所要求的的/api/user/login，因此可以手动封装一个post方法，此处为优化1
    // 2--我们现在是用then/catch方法进行Promise的处理，如果不断地then下去，会造成回调地狱，因此可以采用Vue3支持的async/await，是then/catch的完美版，作用与then/catch相同，只是用法上的区别。
    // const handleLogin = ()=>{
    //   // 设置登录状态
    //   axios.post('https://www.fastmock.site/mock/ae8e9031947a302fed5f92425995aa19/jd/api/user/login',{
    //     username:data.username,
    //     password:data.password
    //   }).then(()=>{
    //     localStorage.isLogin = true;
    //     // 在登录之后，通过路由实例跳转
    //     router.push({name:'Home'})
    //     alert('成功')
    //   }).catch(()=>{
    //     alert('失败')
    //   })
    // }
        // 获取路由实例
    const router = useRouter();
    //reactive 是 Vue3 中提供的实现响应式数据的方法。
    const data = reactive({
      username:'',
      password:'',
    })//到这里setup()函数只能导出data
    // toRefs 用于将响应式对象转换为结果对象，其中结果对象的每个属性都是指向原始对象相应属性的ref
    const {username,password} = toRefs(data);//到这里setup()函数可以导出username和password
    const handleLogin = async()=>{
      // 可以使用try/catch监听Promise 返回状态，try为成功，catch失败
      try{
        // 设置登录状态
        const {username,password} = data;
        let result='';
        if(username==''||password==''){
          showToast('请输入用户名或密码')
          return;
        }else{
        // 每遇到一个await都会先返回,再往下执行,变成了同步操作
        result = await post('/api/user/login',{
          username:data.username,
          password:data.password
        })
        }
        // result?.data?.errno的意思是尝试获取result中的data中的error属性，它和result.data.errno的意思是一样的，但是比result.data.errno的容错性更高。
        // 代码会尝试查找errno，如果查找不到，会返回undefined，而不会报错
        if(result?.errno===0){
          localStorage.isLogin = true;
          // 在登录之后，通过路由实例跳转
          router.push({name:'MiserWare'})
          showToast('登录成功')
        }else{
          showToast('登录失败')
        }
      }catch(e){
        showToast('请求失败')
      }
    }
    return {username,password,handleLogin}
}
// 跳转到注册页面逻辑处理
const useRegisterEffect = ()=>{
    // 获取路由实例
    const router = useRouter();
    const handleRegisterClick = () =>{
      // 在登录之后，通过路由实例跳转
      router.push({name:'RegisterView'})
    }
    return {handleRegisterClick}
}
export default {
  name: 'LoginView',
  components:{ToastView},
  // setup函数的职责：告诉你代码执行的一个流程
  setup(){

    const {show,toastMessage,showToast} = useToastEffect()
    const { username,password,handleLogin } = useLoginEffect(showToast)
    const {handleRegisterClick} = useRegisterEffect();

    return { 
      show,toastMessage,username,password,
      handleLogin,handleRegisterClick
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/viriables.scss';
.bgContainer{
  width:100%;
  height: 100vh;
  background-repeat: no-repeat !important;
	background-size: 100% 100% !important;
  background:url('../../assets/images/bg.jpg');
}
.wrapper {
  background-color: rgba(0, 0, 0, .1);
  width:5rem;
  position: absolute;
  top: 35%;
  left:50%;
  margin-left: -2.5rem;
  transform: translateY(-50%);
  &__img {
    display: block;
    margin: 0.15rem auto .4rem auto;
    width: .66rem;
    height: .66rem;
  }
  &__input {
    height: .48rem;
    margin: 0 .4rem .16rem .4rem;
    padding: 0 .16rem;
    background: #F9F9F9;
    border: .01rem solid rgba(0,0,0,0.10);
    border-radius: .06rem;
    border-radius: .06rem;
    &__content {
      line-height: .48rem;
      border: none;
      outline: none;
      width: 100%;
      background: none;
      font-size: .16rem;
      color: $content-notice-fontColor;
      &::placeholder {
        color: $content-notice-fontColor;
      }
    }
  }
  &__login-button {
    margin: .32rem .4rem .16rem .4rem;
    line-height: .48rem;
    background: #0091FF;
    box-shadow: 0 .04rem .08rem 0 rgba(0,145,255,0.32);
    border-radius: .04rem;
    border-radius: .04rem;
    color: $bgColor;
    font-size: .16rem;
    text-align: center;
    cursor: pointer;
  }
  &__login-link {
    text-align: center;
    font-size: .14rem;
    margin-bottom: 0.15rem;
    color: $content-notice-fontColor;
    cursor: pointer;
  }
}
</style>