import { asyncRouterMap, constantRouterMap } from "@/config/router.config"

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission(permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = -1
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.indexOf(permission[i])
      if (flag >= 0) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.indexOf(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter(routerMap, roles) {             
  const accessedRouters = routerMap.filter(route => {      //返回过滤得到有权限的路由
    if (hasPermission(roles.permissionList, route)) {
      if (route.children && route.children.length) {      //深度回调
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

function getMenu(name, menus){
  for(let i = 0;i<menus.length;i++){
    let menu = menus[i];
    if(name === menu.title){
      return menu
    }
  }
  return null
}

                                  //创建一个vuex实例
const permission = {
  state: {
    routers: constantRouterMap,  //基础路由表
    addRouters: [],               //添加路由

    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''   //存储cookie
  },
  mutations: {
    SET_ROUTERS: (state, data) => {
      state.addRouters = data
      state.routers = constantRouterMap.concat(data)
      console.log('-----mutations---SET_ROUTERS----', data)
    },

    changeLogin (state, user) {                                                                 //修改token,并存入localStorage
      state.Authorization = user.Authorization;
      localStorage.setItem('Authorization', user.Authorization);                            
    }
  },
  actions: {
    //生成路由
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        console.log('-----mutations---data----', data)
        let accessedRouters
        accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        console.log('-----mutations---accessedRouters----', accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    // GenerateRoutes({ commit }, data) {
    //   return new Promise(resolve => {
    //     const { roles } = data
    //     console.log('-----mutations---data----', data)
    //     let accessedRouters
    //     accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
    //     console.log('-----mutations---accessedRouters----', accessedRouters)
    //     commit('SET_ROUTERS', accessedRouters)
    //     resolve()
    //   })
    // },
    // 动态添加主界面路由，需要缓存
    UpdateAppRouter({ commit }, routes) {
      return new Promise(resolve => {
        //const [ roles ] = routes.constRoutes
        let routelist = routes.constRoutes;
        commit('SET_ROUTERS', routelist)
        resolve()
      })
    }
  }
}

export default permission