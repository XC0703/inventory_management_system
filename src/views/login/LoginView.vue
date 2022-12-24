<template>
<div class="bgContainer">
  <div class="wrapper">
    <div class="wrapper__logintext">
        <h2>Welcome</h2>
    </div>
    <div class="wrapper__input">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="userId">
            <el-input
              v-model.number="form.userName"
              clearable
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              v-model="form.passWord"
              clearable
              placeholder="请输入密码"
              show-passWord
            ></el-input>
          </el-form-item>
        </el-form>
    </div>
    <div class="wrapper__tool">
        <div class="wrapper__tool__remenberTool">
          <el-checkbox v-model="checked" @change="remenber" style="color:#fff;">记住密码</el-checkbox>
        </div>
        <div class="wrapper__tool__forgetpasTool" @click="forgetpas">忘记密码？</div>
    </div>
    <div class="wrapper__login-button" @click=handleLogin(form)>登录</div>
    <!-- 像这样通过router-link :to跳转，会在外层自动包裹一个a标签 -->
    <!-- <router-link :to="{name:'RegisterView'}">
      <div class="wrapper__login-link">立即注册</div>
    </router-link> -->
    <!-- 因此采取事件绑定的方式进行事件跳转 -->
    <div class="wrapper__login-link" @click="handleRegisterClick">立即注册</div>
  </div>
</div>
</template>

<script>
import router from '@/router'
import { get,post } from '../../utils/request';

export default {
  name: 'LoginView',
  data(){
    return{
      form: {
        userName: "",
        passWord: "",
      },
      rules: {
        user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" },],
      },
      checked: false,
    }
  },
  mounted() {
      if(localStorage.getItem("remUser")){
        this.form=JSON.parse(localStorage.getItem("remUser"))
        this.checked=true
      }
  },
  methods:{
    // 登录
    async handleLogin(form){
      try{
        let result='';
        let submitData = {
          userId:'',
          userName:'',
          userPassword:'',
          userPower:'',
          createTime:'',
          updateTime:''
        };
        if(form.userName==''||form.passWord==''){
          this.$message.info('请输入账户或密码')
          return;
        }else{
          submitData.userId = '后端处理userId',
          submitData.userName = form.userName,
          submitData.userPassword = form.passWord,
          submitData.userPower = '后端处理userPower',
          submitData.createTime = '后端处理createTime',
          submitData.updateTime = '后端处理updateTime',
          // console.log("请求路由：/miserauth/login")
          // console.log(submitData)
          // 每遇到一个await都会先返回,再往下执行,变成了同步操作
          // console.log(submitData)
          result = await post('/miserauth/login',submitData)
        }
        // result?.data?.errno的意思是尝试获取result中的data中的error属性，它和result.data.errno的意思是一样的，但是比result.data.errno的容错性更高。
        // 代码会尝试查找errno，如果查找不到，会返回undefined，而不会报错
        if(result?.msg === "success"){
          sessionStorage.isLogin = true;
          // 在登录之后，通过路由实例跳转
          router.push({name:'MiserWare'})
          this.$message.success('登录成功')
          this.getLoginUser()
        }else if(result?.msg === "密码输入错误"){
          this.$message.info('密码输入错误')
        }else if(result?.msg === "该用户不存在"){
          this.$message.info('该用户不存在')
        }else if(result?.msg === "该用户已登录"){
          this.$message.info('该用户已登录')
        }else{
          this.$message.error('登录失败')
        }
      }catch(e){
        this.$message.error('登录失败')
      }
    },
    // 切换到注册页面
    async handleRegisterClick(){
      router.push({name:'RegisterView'})
      this.$message.info("系统默认注册低权限管理员，若想提高权限，请联系高级管理员")
    },
    // 获得当前登录信息，需要用到的地方：
    // 1、登录时验证是否为超级管理员，是的话开放用户管理功能，同时临时订单展示所有；不是则关闭用户管理功能，同时临时订单展示该管理员对应的临时订单
    // 2、在物品管理页面加入订单或者临时订单时，绑定当前所登录用户信息
    async getLoginUser(){
        try{
            const result = await get('miserauth/getloginUser')
            if (result?.msg === "success" && result?.userInfo) {
              // console.log(result.userInfo.fields)
              this.$store.commit('changeUserInfo',result.userInfo.fields)
              // this.$message.success('获取当前所登录用户信息成功！')
            }else{
              this.$message.info('未查找到登录信息！')
            }
        }catch{
              this.$message.error('获取当前所登录用户信息失败！')
        }
    },
    // 记住密码
    remenber(data){
      this.checked=data
      if(this.checked){
          localStorage.setItem("remUser",JSON.stringify(this.form))
      }else{
        localStorage.removeItem("remUser")
      }
    },
    // 忘记密码
    forgetpas(){
      this.$message.info('请联系高级管理员或系统开发者进行密码修改')
    }
  }
}
</script>

<style lang="scss" scoped>
.bgContainer{
  width:100%;
  height: 100vh;
  background-repeat: no-repeat !important;
	background-size: 100% 100% !important;
  background:url('../../assets/images/bg.jpg');
}
.wrapper {
  background-color: rgba(0, 0, 0, .1);
  width:4.5rem;
  position: absolute;
  top: 27%;
  left:50%;
  margin-left: -2.25rem;
  transform: translateY(-50%);
  &__logintext {
    margin-bottom: 0.2rem;
    line-height: 0.5rem;
    text-align: center;
    font-size: 0.3rem;
    font-weight: bolder;
    color: #fff;
    text-shadow: 0.02rem 0.02rem 0.04rem #000000;
  }
  &__input {
    width: 3.8rem;
    transform: translate(-50%);
    margin-left: 50%;
  }
  &__tool{
    width: 3.8rem;
    height: .3rem;
    margin:0 auto;
    color:#fff;
    &__remenberTool{
      height: .3rem;
      float:left;
    }
    &__forgetpasTool{
      height: .3rem;
      line-height: .3rem;
      font-size: .14rem;
      float:right;
      cursor: pointer;
    }
  }
  &__login-button {
    margin: .14rem 1.4rem .16rem 1.4rem;
    line-height: .3rem;
    background: #0091FF;
    box-shadow: 0 .04rem .08rem 0 rgba(0,145,255,0.32);
    border-radius: .04rem;
    border-radius: .04rem;
    color: #fff;
    font-size: .16rem;
    text-align: center;
    letter-spacing:.4rem;
    text-indent: .4rem;
    cursor: pointer;
  }
  &__login-link {
    margin:0 1.4rem 0.15rem 1.4rem;
    text-align: center;
    font-size: .14rem;
    color: #999;
    cursor: pointer;
  }
}
</style>