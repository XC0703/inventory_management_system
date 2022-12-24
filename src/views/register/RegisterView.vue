<template>
  <div class="bgContainer">
    <div class="wrapper">
      <div class="wrapper__logintext">
          <h2>Welcome</h2>
      </div>
      <div class="wrapper__input">
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item prop="userName">
              <el-input
                v-model="form.userName"
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
            <el-form-item prop="confirmPas">
              <el-input
                v-model="form.confirmPas"
                clearable
                placeholder="确认密码"
                show-passWord
              ></el-input>
            </el-form-item>
          </el-form>
      </div>
      <div class="wrapper__login-button" @click=handleRegister(form)>注册</div>
      <div class="wrapper__login-link" @click="handleLoginClick">已有账号，返回登录</div>
    </div>
    <div></div>
  </div>
  </template>
  
  <script>
  import router from '@/router'
  import {post} from '../../utils/request';
  
  export default {
    name: 'RegisterView',
    data(){
      return{
        form: {
          userName: "",
          passWord: "",
          confirmPas:""
        },
        rules: {
          userName: [{ required: true, message: "请输入用户名", trigger: "blur" },
                    { max: 15, message: "不能大于15个字符", trigger: "blur" }],
          passWord: [{ required: true, message: "请输入密码", trigger: "blur" },
                    { max: 20, message: "不能大于20个字符", trigger: "blur" }]
        },
      }
    },
    methods:{
      async handleRegister(form){
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
          if(form.userName==''||form.passWord==''||form.confirmPas==''){
            this.$message.info('请输入用户名或密码')
            return;
          }else if(form.confirmPas!=form.passWord){
            this.$message.info('两次密码输入不一致，请重新输入')
          }else{
            submitData.userId = '后端处理userId',
            submitData.userName = form.userName,
            submitData.userPassword = form.passWord,
            submitData.userPower = '默认注册低权限用户',
            submitData.createTime = '后端处理createTime',
            submitData.updateTime = '后端处理updateTime',
            // console.log("请求路由：miserauth/register")
            // console.log(submitData)
            // 每遇到一个await都会先返回,再往下执行,变成了同步操作
            result = await post('miserauth/register',submitData)
            // console.log(result.msg)
            // result?.data?.errno的意思是尝试获取result中的data中的error属性，它和result.data.errno的意思是一样的，但是比result.data.errno的容错性更高。
            // 代码会尝试查找errno，如果查找不到，会返回undefined，而不会报错
            if(result?.msg === "success"){
              // 在注册之后，通过路由实例跳转
              router.push({name:'LoginView'})
              this.$message.success('注册成功')
            }else if(result?.msg === "用户名或密码过长"){
              this.$message.info('用户名或密码过长,请重新注册')
            }else if(result?.msg === "用户已存在"){
              this.$message.info('用户已存在,请重新注册')
            }else{
              this.$message.error('注册失败')
            }
          }
        }catch(e){
          this.$message.error('注册失败')
        }
      },
      async handleLoginClick(){
        router.push({name:'LoginView'})
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