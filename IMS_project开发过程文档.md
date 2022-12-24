<a name="mdG5z"></a>
### 1. 项目初始化
- 具备登陆界面、用户管理界面、订单管理界面、物品管理界面
- 对物品管理界面的物品增加“加入临时订单”按钮
- 使用字
<a name="eorXH"></a>
#### 1.1 Vue环境配置
```javascript
npm install -g @vue/cli
```
<a name="DfbDc"></a>
#### 1.2 新建项目
```javascript
vue create inventory_management_system
```
<a name="tVCnM"></a>
#### 1.3 安装所需插件

- ESLint插件：协助做代码校验，规范代码
- Vetur插件：识别、高亮显示Vue语法
- Volar插件：在功能上 Volar 和 Vetur 是一致的，都是针对 vue 的插件，但是 Volar 的功能却要强大得多
<a name="ZDowU"></a>
#### 1.4 安装所需第三方库依赖模块

- 安装axios
```javascript
npm install --save axios 
```

- 安装v-router
```javascript
// 这里安装的是vue-router 4 不指定版本安装的是vue-router3.5 对于后面的写法会报错
npm install vue-router@4
```

- 安装v-vuex
```javascript
npm install vuex@4
```

- 有些HTML标签，同一个标签，在不同的浏览器上，展示效果不一致； 为了 写出来的样式 可以在所有的浏览器上 保持一致， 需要借助一下normallize.css。
```javascript
npm install normalize.css --save
```

- 安装element-plus组件库
```javascript
npm install element-plus --save
```

- 安装sass
```javascript
npm install node-sass --save-dev
npm install sass-loader --save-dev
```

- 安装defineComponent（可不用，针对ts的）
```javascript
安装：yarn add @vue/composition-api
删除：npm unstall @vue/composition-api
// defineComponent可以给组件的setup方法准确的参数类型定义.
// 引入 defineComponent() 以正确推断 setup() 组件的参数类型
// defineComponent 可以正确适配无 props、数组 props 等形式
// defineComponent 可以接受显式的自定义 props 接口或从属性验证对象中自动推断
// 在 tsx 中，element-ui 等全局注册的组件依然要用 kebab-case 形式
// 在 tsx 中，v-model 要用 model={{ value, callback }} 写法
// 在 tsx 中，scoped slots 要用 scopedSlots={{ foo: (scope) => (<Bar/>) }} 写法
// defineComponent 并不适用于函数式组件，应使用 RenderContext<interface> 解决
```
<a name="PY7NW"></a>
#### 1.5 项目目录
node_modules：存放第三方库依赖模块<br />public：配置了一些通用的内容，如这里的index.html中的icon，配置了网页的图标<br />src：源码目录<br />assets：存放资源相关的目录<br />components：公共组件目录<br />router：配置路由目录<br />index.js<br />store：配置状态管理目录<br />index.js<br />style<br />index.scss：引入如base.scss、iconfont.css及viriables.scss等文件，可以使main.js直接引入index.scss<br />即可<br />base.scss：在这里我们设置了 html 与 body 的字号，方便在样式中使用rem来实现响应式的字体<br />viriables.scss：主要来定义一些颜色变量（方便一些多次用到的颜色）<br />mixins.scss：将一些固定样式进行封装，然后通过@include语法引入<br />iconfont.css：主要来引用图标字体<br />utils<br />request.js：存放Ajax相关的目录<br />views：存放路由组件目录<br />login：登陆功能<br />Login.vue<br />register：注册功能<br />Register.vue<br />App.vue：项目根组件<br />main.js：入口js文件<br />babel.comfig.js：vue里面用到的一些babel的配置<br />jsconfig.json：当您在工作空间中有一个定义项目上下文的jsconfig.json文件<br />时，JavaScript体验会得到改进。默认启用了一些编译器标志。<br />package.json：记录第三方库依赖的目录<br />README.md：项目描述文本<br />vue.config.js：当我们想要定义一些全局变量，比如常用的包管理器或者部署应<br />用包的基本URL时，可以通过vue.config.js配置文件定义。vue.config.js 是<br />一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在<br />这个文件，那么它被 @vue/cli-service 自动加载。<br />yarn.lock：保证多人协作的时候，依赖能有一个固定的版本

---

<a name="Gt7gj"></a>
### 2. 新get知识点
<a name="Y5oIE"></a>
#### 2.1 折叠面板
![image.png](https://cdn.nlark.com/yuque/0/2022/png/27865087/1666774610529-6a9fe2d9-6d63-48eb-8e54-ac3edd7359fa.png#averageHue=%23f8f8f7&clientId=u359a55ff-17a1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=166&id=u88213bb1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=249&originWidth=1090&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26409&status=done&style=none&taskId=ud9055075-5440-4a7b-a4a6-f5fffd55c76&title=&width=726.6666666666666)<br />menuunique-opened属性：可以控制菜单侧边栏显示，是否只显示一个子菜单设置（默认为true）
```javascript
<el-menu default-active="2" :collapse="collapsed" collapse-transition unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
```
<a name="iWaDd"></a>
#### 2.2 弹出提示
```javascript
    //设置、个人中心未开发的提示
    content(){
      this.$confirm('功能尚未开发，敬请期待！', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      })
    },
```
<a name="YD1nU"></a>
#### 2.3 vue3中使用Bus全局事件实现跨组件通信（应用于使用数据总线，在非父子的组件之间通讯，完成左侧菜单折叠）
:::info
Vue3.x以后从实例中移除了 o n ， on，on，off 和 o n c e 方 法 ， once 方法，once方法，emit 仍然是现有 API 的一部分，只能实现子组件触发父组件的方法，vue的bus无法使用，可借用第三方插件mitt实现跨组件传值。
:::
```javascript
//1--安装依赖安装依赖mitt
npm install --save mitt
or
cnpm install --save mitt
```
```javascript
//2--在main.js中
import mitt from 'mitt'
app.config.globalProperties.$bus = new mitt() // event Bus 用于无关系组件间的通信
```
```javascript
//3--在传数据的TopNav.vue中
  methods: {
    // 触发切换显示
    toggle(showtype) {
      this.collapsed = !showtype
      this.$bus.emit('toggle', this.collapsed)
    }
  },
```
```javascript
//4--在传数据的HomeView.vue中
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
```
<a name="jk9Pq"></a>
#### 2.4 路由嵌套--为了实现不同子路由切换时，子组件跟着切换，即菜单栏功能
在IndexView.vue 里，设置组件跟随路由变化而变化：
```javascript
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
```
在router里面，设置嵌套路由，子组件：
```javascript
{
    path:'/',
    name:'IndexView',
    // 异步组件，只有访问的时候才加载,"index"指的是代码包的名字
    component:()=>import(/* webpackChunName:"index" */ '../views/index/IndexView'),
    redirect: '/miserware',  //默认跳转到miserware路由
    hidden: true,
    children:[
        {
            path:'misercart',
            name:'MiserCart',
            component:()=>import(/* webpackChunName:"misercart" */ '../views/misercart/MiserCart')
        },
    ]
},
```
在菜单栏组件LeftNav里面，设置路由跳转：
```javascript
//el-menu中绑定路由
<el-menu router :default-active="this.$route.path" :default-openeds="['1']" >
//一定要设置el-submenu的index属性（1，2，3…）注意：index要字符串格式，否则会报警告
<el-sub-menu v-for="menu in allmenu" :key="menu.menuname" :index=menu.menuid> 
//el-menu-item的index设为要跳转的路由（点击菜单项，会直接push到点击的页面)。
<el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">
```
若想让浏览器刷新后回到默认页面，则需在app.vue里面添加：
```javascript
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
```
<a name="RJV83"></a>
#### 2.5 本项目中，前端分页效果的实现（借助Element-Plus中的el-pagination组件）
介绍链接：[https://www.waimaiguai.com/technology/article/4952033](https://www.waimaiguai.com/technology/article/4952033)
:::info
分页总的过程可以概括为：<br />①刚开始，父组件通过v-bind:child-msg="pageparm"将父组件初始的pageparm传递给子组件，子组件用props: ['childMsg']接收后，存储在子组件自己的pageparm中。<br />②子组件通过@size-change="handleSizeChange"/@current-change="handleCurrentChange" 监听page-size/current-change的改变，若改变，则将改变后的pageparm作为参数传递给父组件的@callFather方法并调用。<br />③父组件中，callFather方法被执行后，将上述传递过来的作为参数的pageparm存储在父组件的formInline（该变量按理说应该是用于请求后端分页的，但是本项目是前端分页，因此只作为一个分页中间变量参数）。<br />④之后调用父组件中用于发起获取数据的showWare()方法，将formInline传递给父组件的pageparm，同时也将获取的数据长度total传递给父组件的pageparm（formInline中只有pageSize、currentPage两个参数）。<br />⑤父组件的pageparm得到更新后，由于 <el-table  :data="wareList.slice((pageparm.currentPage - 1) * pageparm.pageSize, pageparm.currentPage * pageparm.pageSize)" >，因此可以完成分页。
:::
1、在components文件夹中定义一个公共组件PaginateView（子组件）：
```javascript
<!-- 分页组件 -->
<template>
    <el-pagination class="page-box" 
  								@size-change="handleSizeChange" 
                  @current-change="handleCurrentChange" 
                  background :current-page="childMsg.currentPage" 
                  :page-sizes="[10, 20, 30, 40]" 
                  :page-size="childMsg.pageSize" 
                  layout="total, sizes, prev, pager, next, jumper" 
                  :total="childMsg.total">
    </el-pagination>
</template>

<script>
export default {
    name: 'PaginateView',
    props: ['childMsg'],//props-接收父组件传过来的分页参数
    data() {
        return {
          // 拿到父组件传过来的分页参数
            pageparm: {
                currentPage: this.childMsg.currentPage,
                pageSize: this.childMsg.pageSize
            }
        }
    },
    created() {},
    methods: {
      // 监听page-size改变时执行的方法
        handleSizeChange(val) {
        /**
         * 子传父
         * 参数1 父元素方法
         * 参数2 数据
         */
        this.pageparm.pageSize = val  //改变pageparm.pageSize，val已被监听到
        this.$emit('callFather', this.pageparm) //子传父，并调用父组件的方法
        },
      // 监听current-change改变时执行的方法
        handleCurrentChange(val) {
        /**
         * 子传父
         * 参数1 父元素方法
         * 参数2 数据
         */
        this.pageparm.currentPage = val  //改变pageparm.currentPage，val已被监听到
        this.$emit('callFather', this.pageparm) //子传父，传参并调用父组件的方法
        }
    },
}
</script>

<style>
.page-box {
    margin: 0 auto;
}
</style>
```
2、PaginateView公共组件在父组件中使用
```javascript
///1--template模板中
<!-- 分页组件 -->
// 由父组件的pageparm单项绑定，更新子数据,callFather是子组件中参数变化触发的
<PaginateView v-bind:child-msg="pageparm" @callFather="callFather"></PaginateView>


// 2--data中定义的参数
// 分页的中间变量，作为初始发送的数据或者接收分页子组件的变化数据，数据最终发送到后端进行分页处理
formInline: {
  page: 1,
  limit: 10,
},
// 分页参数，父组件单项绑定-->指向分页子组件的props:[childMsg]
// :data="wareList.slice((pageparm.currentPage - 1) * pageparm.pageSize, pageparm.currentPage * pageparm.pageSize)"
pageparm: {
  currentPage: 1,
  pageSize: 10,
  total: 0
},


// 3--分页插件事件--通过改变分页中间变量来改变分:data="wareList.slice((pageparm.currentPage - 1) * pageparm.pageSize, pageparm.currentPage * pageparm.pageSize)"页参数（parm是子组件传过来的参数）
// 子组件参数变化触发的父组件方法
callFather(parm) {
  this.formInline.page = parm.currentPage
  this.formInline.limit = parm.pageSize
  // 然后再次调用页面加载的方法(改变this.pageparm)
	this.getWareList()
  // this.showWare()
  this.sortChange(this.column)
},


// 4--展示查询数据--改变this.pageparm
async showWare(){
  // 将接口获取的数据进行处理
  this.wareList = JSON.parse(JSON.stringify(getWare(this.query)));
  this.loading = false
  this.pageparm.currentPage = this.formInline.page
  this.pageparm.pageSize = this.formInline.limit
  this.pageparm.total =  this.wareList.length
},
```
<a name="QQur3"></a>
#### 2.6 ::v-deep实现穿透效果（可以用来改变elelment-plus组件的默认样式）
现在控制台里面找到想要改变的组件类名，如.el-input__wrapper
```
//如果想设置本页面所有的.el-input__wrapper的样式，只需：
::v-deep .el-input__wrapper{
	这里写样式
}
//也可加上父节点，如：
.a{
  ::v-deep .el-input__wrapper{
  	这里写样式
  }
}
```
<a name="Ehp1V"></a>
#### 2.7 vue3全局引入element-plus后如何使用Message消息提示
```javascript
// 引入
import { ElMessage } from "element-plus";
// 使用
ElMessage.info("未获取到数据，请重新输入！");
```

<a name="NgNZ9"></a>
### 3. 遇到的一些问题及解决
<a name="pQBbB"></a>
#### 3.1 Vue.js前台报Uncaught (in promise) cancel错误解决办法
![image.png](https://cdn.nlark.com/yuque/0/2022/png/27865087/1666837587164-af73d898-e146-4c36-87b4-f12fb3047102.png#averageHue=%23f7f2f2&clientId=u110710ff-354d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=111&id=uc367f502&margin=%5Bobject%20Object%5D&name=image.png&originHeight=166&originWidth=1158&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17744&status=done&style=none&taskId=u622e1f33-a4b5-4b13-a198-b658f5e2182&title=&width=772)<br />解决办法：在this.$confirm方法后加上.catch方法即可。
```javascript
    //设置、个人中心未开发的提示
    content(){
      this.$confirm('功能尚未开发，敬请期待！', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).catch(()=>{})//记得要catch
    },
```
<a name="Ruftl"></a>
#### 3.2 el-input设置了clearable后，只能在特定位置点击触发
原因：右边默认的搜索框插槽挡住了位置，要设置好相关样式。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/27865087/1667285186874-3e1c28c1-47a5-4ebc-a159-b848282d0f1b.png#averageHue=%23f9f9f8&clientId=uacafcfac-e072-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=417&id=u63ae2030&margin=%5Bobject%20Object%5D&name=image.png&originHeight=625&originWidth=958&originalType=binary&ratio=1&rotation=0&showTitle=false&size=92756&status=done&style=none&taskId=u60e783e8-8961-4210-91bd-a27037a87b2&title=&width=638.6666666666666)
<a name="ETaJx"></a>
#### 3.3 Element-UI 导出Table表格报错 TypeError: Cannot read properties of undefined (reading ‘utils‘)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/27865087/1667311358348-8e56787f-6e8b-4f58-9aec-7de888cdb7c4.png#averageHue=%23faf4f3&clientId=u4601b975-793a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=215&id=u1c6013c5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=322&originWidth=1434&originalType=binary&ratio=1&rotation=0&showTitle=false&size=34999&status=done&style=none&taskId=u91f28f49-4ccb-4261-b3f3-ca162edb2b5&title=&width=956)<br />解决方案：把exportExcel.js中的import XLSX from 'xlsx'变成import * as XLSX from 'xlsx'
<a name="YQ0of"></a>
#### 3.4 import无法引入js中导出的方法
解决方法：多个导出时，用export{}，不是用export default{}。<br />export与export default的异同：

- 相同点：
   1. export default 向外暴露的成员，可以使用任意的变量来接收
   2. 在一个模块中，export default只允许向外暴露一次
   3. 在一个模块中，可以同时使用export default 和 export向外暴露成员
   4. 使用export向外暴露成员，只能用{}的形式来接收，这种形式，叫做【按需导出】
   5. export可以向外暴露多个成员，同时，如果某些成员，我们在import的时候不需要，则可以不在{}中定义
   6. 使用export导出的成员必须严格按照到处时候的名称，来使用{}按需接收；
   7. 如果使用export按需导出的成员想换名称，可以用as进行替换
   8.  导入成组的方法：  import * as tools from './tools'  其中tools.js中有多个export方法
- 不同点：
   1.  export  导出 ：import {a,b} from './util'  需要加花括号 里面可以是一个或多个（按需导出）
   2.  export default 导出：import a from './util'  不需要加花括号 只能一个一个导入（一个一个的导出）
<a name="qiLZ1"></a>
#### 3.5 原本的代码无法实现需求——就是发起了请求，请求成功的时候返回请求的值给外部使用，请求失败的时候返回一个空数组给外部使用。
原来的代码如下：<br />![6c32db3c57b97d7142e3f69a7f9d056.jpg](https://cdn.nlark.com/yuque/0/2022/jpeg/27865087/1667831417001-ee3d76dc-b0f0-4b8d-8edf-73eeb35795e3.jpeg#averageHue=%23323225&clientId=u0396926c-d380-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=421&id=u03609e9d&margin=%5Bobject%20Object%5D&name=6c32db3c57b97d7142e3f69a7f9d056.jpg&originHeight=631&originWidth=1041&originalType=binary&ratio=1&rotation=0&showTitle=false&size=59477&status=done&style=none&taskId=u8c584817-af5d-4c23-a859-abad696b8c4&title=&width=694)<br />解决办法：选择用promise语法糖了也就失去了灵活度的控制，如果非要同时可以返回promise和正常值，就用promise或者在异步函数外面包装一层。<br />改进后的代码如下所示：<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/27865087/1667831634234-ff6e3b68-b2c4-4583-afc0-24a353e01a69.png#averageHue=%2321201f&clientId=u0396926c-d380-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=567&id=uf19f51d2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=850&originWidth=1030&originalType=binary&ratio=1&rotation=0&showTitle=false&size=124598&status=done&style=none&taskId=ub0ed79dc-87a1-4630-b2d2-8e22bae1fdb&title=&width=686.6666666666666)
<a name="DrWYV"></a>
#### 3.6 vue中无法清除正在执行的setTimeout定时器的问题

- 解决办法：把定时器挂载到window中，定时器变量在data中初始化。
```javascript
    data(){
        return{
            selectHover:false,
            timer:null
        }
    },
    methods:{
        handleSelect(flag){
            if(!flag){
                this.timer = window.setTimeout(()=>{
                    this.selectHover = false
                },500)
            }else{
                window.clearTimeout(this.timer);
                this.timer = null;
                this.selectHover = true
            }
        }
    },
```
<a name="PhPrl"></a>
#### 3.7 无法将get获取数据的函数单独放在一个js文件里面，返回值给页面的问题

- 解决方式：放弃挣扎，将该函数放在vue页面里面，否则不可能做到。
<a name="zkkgx"></a>
#### 3.8 不刷新，重新登录进去后store.state内容不发生变化的问题
解决办法：监听store.state的变化
```javascript
watch:{
  "$store.state.userInfo":{
    deep:true,
      handler:function(){
      // console.log(this.$store.state.userInfo)
      const userPower = this.$store.state.userInfo.userPower
      // console.log(userPower)
      if(userPower>100){
        this.userIdentity="超级管理员"
      }else{
        this.userIdentity="普通管理员"
      }
    }
  }
},
```
此时发现虽然能监听到变化了，但发现第一个对登录的用户不起作用，更改：
```javascript
  computed:{
    userIdentity:function(){
      let userIdentity = ''
        // console.log(this.$store.state.userInfo)
        const userPower = this.$store.state.userInfo.userPower
        // console.log(userPower)
        if(userPower>100){
          userIdentity="超级管理员"
        }else{
          userIdentity="普通管理员"
        }
        return userIdentity
    }
  },
```
可以了。
