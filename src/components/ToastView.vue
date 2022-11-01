<!-- 登录注册时的信息提示组件 -->
<template>
    <div class="toast">{{message}}</div>
</template>

<script>
import {reactive,toRefs} from 'vue';
export default {
    name:'LoginView',
    // 子组件接收父组件传过来的参数
    props:['message'],
}
export const useToastEffect = ()=>{
  const toastData = reactive({
    show:false,
    toastMessage:''
  })
  const showToast = (message)=>{
      toastData.show=true;
      toastData.toastMessage=message;
      setTimeout(()=>{
          toastData.show=false,
          toastData.toastMessage=''
      },2000)
    }

    const {show,toastMessage}=toRefs(toastData);
  return {show,toastMessage,showToast}
}
</script>

<style lang="scss" scoped>
@import '../style/viriables.scss';
.toast{
    position: fixed;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    padding:.02rem;
    background-color: rgba(0,0,0,.35);
    border-radius:.03rem;
    color:$bgColor;
    font-size: .15rem;
}
</style>
