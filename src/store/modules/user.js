import Vue from 'vue'
import { login, logout, phoneLogin, thirdLogin,getInfo} from "@/api/login"
import { ACCESS_TOKEN, USER_NAME,USER_INFO,USER_AUTH,SYS_BUTTON_AUTH,UI_CACHE_DB_DICT_DATA,TENANT_ID,CACHE_INCLUDED_ROUTES } from "@/store/mutation-types"
import { welcome } from "@/utils/util"
import { queryPermissionsByUser } from '@/api/api'
import { getToken, setToken, removeToken } from "@/utils/auth"; //该文件封装cookies，将token暂存在cookies中
import { getAction } from '@/api/manage'
import { reject } from 'lodash'

const user = {
  state: {                    //存放需要多组件共享的状态
    token: '',
    username: '',
    realname: '',
    tenantid:'',
    welcome: '',
    avatar: '',
    permissionList: [],//省略不用
    info: {},
    name: '',
    roles: [], //额外加入
  },

  mutations: {                //存放更改state里状态的方法
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    // SET_NAME: (state, { username, realname, welcome }) => {
    //   state.username = username
    //   state.realname = realname
    //   state.welcome = welcome
    // },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_TENANT: (state, id) => {
      state.tenantid = id
    },
    //自己补充
    SET_NAME: (state,name) => {
      state.name=name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
  },

  actions: {                 //actions是mutation的加强版可异步、  getters是从state中派生出新状态
    //CAS验证登录
    ValidateLogin({ commit }, Info) {
      return new Promise((resolve, reject) => {
        getAction("/sys/cas/client/validateLogin",Info).then(response => {
          console.log("----cas 登录--------",response);
          if(response.success){
            const data = response.data;
            // const userInfo = result.userInfo
            const tokenStr = data.tokenHead + data.token;
            // console.log(tokenStr);
            Vue.ls.set(ACCESS_TOKEN, tokenStr, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_INFO, Info, 7 * 24 * 60 * 60 * 1000)
            // Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
            // Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', tokenStr)
            commit('SET_INFO',Info)
            // commit('SET_INFO', userInfo)
            // commit('SET_NAME', { username: userInfo.username,realname: userInfo.realname, welcome: welcome() })
            // commit('SET_AVATAR', userInfo.avatar)
            resolve(response)
          }else{
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // ValidateLogin({ commit }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     getAction("/sys/cas/client/validateLogin",userInfo).then(response => {
    //       console.log("----cas 登录--------",response);
    //       if(response.success){
    //         const result = response.result
    //         const userInfo = result.userInfo
    //         Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
    //         Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
    //         Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
    //         commit('SET_TOKEN', result.token)
    //         commit('SET_INFO', userInfo)
    //         commit('SET_NAME', { username: userInfo.username,realname: userInfo.realname, welcome: welcome() })
    //         commit('SET_AVATAR', userInfo.avatar)
    //         resolve(response)
    //       }else{
    //         resolve(response)
    //       }
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 登录
    // Login({ commit }, Info) {
     
    //   return new Promise((resolve, reject) => {
    //     login(Info).then(response => {
    //       if(response.code =='200'){
    //         const data = response.data;
    //         const tokenStr = data.tokenHead.trim() + data.token;
    //         console.log(tokenStr);
    //         // Vue.ls.set('SET_TOKEN',tokenStr);
    //         //设置有效期7天
    //         Vue.ls.set(ACCESS_TOKEN, tokenStr, 7 * 24 * 60 * 60 * 1000)     
    //         // Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
    //         // console.log(username)
    //         Vue.ls.set(USER_INFO, Info, 7 * 24 * 60 * 60 * 1000)
    //         console.log(Info)
    //         // Vue.ls.set(UI_CACHE_DB_DICT_DATA, result.sysAllDictItems, 7 * 24 * 60 * 60 * 1000)
    //         commit('SET_TOKEN', tokenStr)   
    //         commit('SET_INFO',Info)                                                         //必须通过commit提交mutation来更改vuex的store中的状态
    //         // console.log(Info.data)
    //         // console.log(Info.menus)
    //         // commit('SET_NAME', { username: Info.username,realname: userInfo.realname, welcome: welcome() })
    //         // commit('SET_AVATAR', data.icon)
    //         resolve(response)
    //       }else{
    //         reject(response)
    //       }
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    Login({commit},Info){
      return new Promise((resolve,reject) => {
        login(Info).then(response => {
          if(response.code=='200'){
            const data=response.data
            const name=data.username
            // console.log(data)
            // console.log(Info)
            // console.log(Info.username)//用户信息是传入的 在Info里面
            const tokenStr = data.tokenHead + data.token
            // console.log(tokenStr)
            Vue.ls.set(ACCESS_TOKEN, tokenStr, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set( USER_INFO,Info, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', tokenStr) 
            commit('SET_INFO',Info)
            resolve(response) 

          }else{
            reject(response)
          } 
        }).then(res => {
          console.log("返回的结果： "+res)
          getInfo().then(res => {   //不确定是否加上,'Authorization':  loginToken
            if(res.code=='200'){
              const result=res.data
              console.log(result)
              const roles=result.roles
              const name=result.username
              commit('SET_ROLES',roles)
              commit('SET_NAME',name)
            }else{
              reject(res)
            } 
            // console.log(res)
          })
        })
      })

    },
    
      
     // 获取用户信息
    //  GetInfo ({ commit},userInfo) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(userInfo).then(response => {
    //       if(response.code =='200'){
    //         const data=response.data;
    //         const name=data.username;
    //         Vue.ls.set(SET_NAME,name);
    //         console.log(name);
    //         commit('SET_NAME', name)
    //         resolve(response)
    //       }else{
    //         reject(response)
    //       }
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    
    // Login({ commit }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     login(userInfo).then(response => {
    //       if(response.code =='200'){
    //         const result = response.result
    //         const userInfo = result.userInfo
    //         Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
    //         Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
    //         Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
    //         Vue.ls.set(UI_CACHE_DB_DICT_DATA, result.sysAllDictItems, 7 * 24 * 60 * 60 * 1000)
    //         commit('SET_TOKEN', result.token)
    //         commit('SET_INFO', userInfo)
    //         commit('SET_NAME', { username: userInfo.username,realname: userInfo.realname, welcome: welcome() })
    //         commit('SET_AVATAR', userInfo.avatar)
    //         resolve(response)
    //       }else{
    //         reject(response)
    //       }
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

   
    //手机号登录
    PhoneLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
          phoneLogin(userInfo).then(response => {
          if(response.code =='200'){
        const result = response.result
        const userInfo = result.userInfo
        Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
        Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
        Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
        Vue.ls.set(UI_CACHE_DB_DICT_DATA, result.sysAllDictItems, 7 * 24 * 60 * 60 * 1000)
        commit('SET_TOKEN', result.token)
        commit('SET_INFO', userInfo)
        commit('SET_NAME', { username: userInfo.username,realname: userInfo.realname, welcome: welcome() })
        commit('SET_AVATAR', userInfo.avatar)
        resolve(response)
      }else{
        reject(response)
      }
    }).catch(error => {
        reject(error)
      })
    })
    },

    //获取用户信息
    GetPermissionList({ commit }) {                        
      return new Promise((resolve, reject) => {
        queryPermissionsByUser().then(response => {               //获取各种数据权限信息
          // console.log("获取用户信息");
          const data=response.data;
          console.log(data)
          console.log("获取权限数据queryPermissionsByUser："+data);
          const menus=data.menus;
          console.log("获取菜单menus信息："+menus);
          console.log(menus)
          const roles=data.roles;
          console.log("获取登陆用户角色信息roles："+roles);
          sessionStorage.setItem(USER_AUTH,JSON.stringify(data.roles));
          sessionStorage.setItem(SYS_BUTTON_AUTH,JSON.stringify(data.roles));
          if (menus && menus.length > 0) {
            //update--begin--autor:qinfeng-----date:20200109------for：JEECG-63 一级菜单的子菜单全部是隐藏路由，则一级菜单不显示------
            menus.forEach((item, index) => {
              if (item["children"]) {
                let hasChildrenMenu = item["children"].filter((i) => {
                  return !i.hidden || i.hidden == false
                })
                if (hasChildrenMenu == null || hasChildrenMenu.length == 0) {
                  item["hidden"] = true
                }
              }
            })
            //console.log(" menu show json ", menuData)            //打印14条对象
            //update--end--autor:qinfeng-----date:20200109------for：JEECG-63 一级菜单的子菜单全部是隐藏路由，则一级菜单不显示------
            commit('SET_PERMISSIONLIST', menus)      //permissionLsit存放的是用户菜单信息
            // commit("SET_NAME", data.user3wwwwname);
            commit("SET_NAME", data.roles);
            commit("SET_AVATAR", data.icon);
          } else {
            reject('getPermissionList: permissions must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },





    // 获取用户信息
    // GetPermissionList({ commit }) {                        
    //   return new Promise((resolve, reject) => {
    //     queryPermissionsByUser().then(response => {               //获取各种数据权限信息
    //       const menuData = response.result.menu;               
    //       const authData = response.result.auth;
    //       const allAuthData = response.result.allAuth;
    //       //Vue.ls.set(USER_AUTH,authData);
    //       sessionStorage.setItem(USER_AUTH,JSON.stringify(authData));
    //       sessionStorage.setItem(SYS_BUTTON_AUTH,JSON.stringify(allAuthData));
    //       if (menuData && menuData.length > 0) {
    //         //update--begin--autor:qinfeng-----date:20200109------for：JEECG-63 一级菜单的子菜单全部是隐藏路由，则一级菜单不显示------
    //         menuData.forEach((item, index) => {
    //           if (item["children"]) {
    //             let hasChildrenMenu = item["children"].filter((i) => {
    //               return !i.hidden || i.hidden == false
    //             })
    //             if (hasChildrenMenu == null || hasChildrenMenu.length == 0) {
    //               item["hidden"] = true
    //             }
    //           }
    //         })
    //         //console.log(" menu show json ", menuData)            //打印14条对象
    //         //update--end--autor:qinfeng-----date:20200109------for：JEECG-63 一级菜单的子菜单全部是隐藏路由，则一级菜单不显示------
    //         commit('SET_PERMISSIONLIST', menuData)
    //       } else {
    //         reject('getPermissionList: permissions must be a non-null array !')
    //       }
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        let logoutToken = state.token;
        commit('SET_TOKEN', '')
        commit('SET_PERMISSIONLIST', [])
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove(USER_INFO)
        Vue.ls.remove(USER_NAME)
        Vue.ls.remove(UI_CACHE_DB_DICT_DATA)
        Vue.ls.remove(CACHE_INCLUDED_ROUTES)
        Vue.ls.remove(TENANT_ID)
        // console.log('logoutToken: '+ logoutToken)
        logout(logoutToken).then(() => {
          if (process.env.VUE_APP_SSO == 'true') {
            let sevice = 'http://' + window.location.host + '/'
            let serviceUrl = encodeURIComponent(sevice)
            window.location.href = process.env.VUE_APP_CAS_BASE_URL + '/logout?service=' + serviceUrl
          }
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    },
    // 第三方登录
    ThirdLogin({ commit }, param) {
      return new Promise((resolve, reject) => {
        thirdLogin(param.token,param.thirdType).then(response => {
          if(response.code =='200'){
            const result = response.result
            const userInfo = result.userInfo
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            commit('SET_INFO', userInfo)
            commit('SET_NAME', { username: userInfo.username,realname: userInfo.realname, welcome: welcome() })
            commit('SET_AVATAR', userInfo.avatar)
            resolve(response)
          }else{
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    saveTenant({ commit }, id){
      Vue.ls.set(TENANT_ID, id, 7 * 24 * 60 * 60 * 1000)
      commit('SET_TENANT', id)
    }


  }
}

export default user