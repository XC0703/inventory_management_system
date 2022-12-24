import Vuex from 'vuex'

export default Vuex.createStore({
    state: {
        // 刷新时使用会话存储
        userInfo: JSON.parse(sessionStorage.getItem('userInfo'))||{}
    },
    mutations: {
        changeUserInfo(state,user){
            // console.log(user)
            //  修改用户数据的时候直接存到本地
            sessionStorage.setItem('userInfo', JSON.stringify(user))
            state.userInfo = user
        }
    },
    actions: {
        
    },
    modules: {
    }
})
