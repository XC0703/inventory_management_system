<template>
<div class="bgContainer">
  <div class="wrapper">
    <img class="wrapper__img" src="http://www.dell-lee.com/imgs/vue3/user.png"/>
    <div class="wrapper__input">
      <input
        class="wrapper__input__content"
        placeholder="请输入用户名"
        v-model="username"
      />
    </div>
    <div class="wrapper__input">
      <input
        type="password"
        class="wrapper__input__content"
        placeholder="请输入密码"
        autocomplete="new-password"
        v-model="password"
      />
    </div>
    <div class="wrapper__input">
      <input
        type="password"
        class="wrapper__input__content"
        placeholder="确认密码"
        v-model="ensurement"
      />
    </div>
    <div class="wrapper__register-button" @click="handleRegister">注册</div>
    <div class="wrapper__register-link" @click="handleLoginClick">已有账号去登陆</div>
    <ToastView v-if="show" :message="toastMessage" />
  </div>
</div>
</template>

<script>
import { useRouter } from 'vue-router';
import {reactive, toRefs} from 'vue';
import {post} from '../../utils/request';
import ToastView,{useToastEffect} from '../../components/ToastView';

// 注册逻辑处理
const useRegisterEffect = (showToast)=>{
    // 获取路由实例
    const router = useRouter();
    //reactive 是 Vue3 中提供的实现响应式数据的方法。
    const data = reactive({
      username:'',
      password:'',
      ensurement:''
    })//到这里setup()函数只能导出data
    // toRefs 用于将响应式对象转换为结果对象，其中结果对象的每个属性都是指向原始对象相应属性的ref
    const {username,password,ensurement} = toRefs(data);//到这里setup()函数可以导出username和password
    const handleRegister = async()=>{
      // 可以使用try/catch监听Promise 返回状态，try为成功，catch失败
      try{
        // 设置登录状态
        const {username,password,ensurement} = data;
        let result='';
        if(username==''||password==''||ensurement==''){
          showToast('请输入用户名或密码')
          return;
        }else{
        // 每遇到一个await都会先返回,再往下执行,变成了同步操作
        // 每遇到一个await都会先返回,再往下执行,变成了同步操作
        result = await post('/api/user/register',{
          username:data.username,
          password:data.password
        })
        }
        // result?.data?.errno的意思是尝试获取result中的data中的error属性，它和result.data.errno的意思是一样的，但是比result.data.errno的容错性更高。
        // 代码会尝试查找errno，如果查找不到，会返回undefined，而不会报错
        if(result?.errno===0){
          router.push({name:'LoginView'})
          showToast('注册成功')
        }else{
          showToast('注册失败')
        }
      }catch(e){
        showToast('请求失败')
      }
    }
    return {username,password,ensurement,handleRegister}
}
// 跳转到登录页面逻辑处理
const useLoginEffect = ()=>{
    // 获取路由实例
    const router = useRouter();
    const handleLoginClick = ()=>{
      router.push({name:'LoginView'})
    };
    return {handleLoginClick}
}
export default {
  name: 'RegisterView',
  components:{ToastView},
  // setup函数的职责：告诉你代码执行的一个流程
  setup() {

    const {show,toastMessage,showToast} = useToastEffect()
    const {username,password,ensurement,handleRegister} = useRegisterEffect(showToast);
    const {handleLoginClick} = useLoginEffect();

    return {
      username,password,ensurement,show,toastMessage,
      handleRegister,handleLoginClick
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
  &__register-button {
    margin: .32rem .4rem .16rem .4rem;
    line-height: .48rem;
    background: $btn-bgColor;
    box-shadow: 0 .04rem .08rem 0 rgba(0,145,255,0.32);
    border-radius: .04rem;
    border-radius: .04rem;
    color: $bgColor;
    font-size: .16rem;
    text-align: center;
    cursor: pointer;
  }
  &__register-link {
    margin-bottom: 0.15rem;
    text-align: center;
    font-size: .14rem;
    color: $content-notice-fontColor;
    cursor: pointer;
  }
}
</style>