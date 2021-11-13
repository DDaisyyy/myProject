import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
// export function login(parameter) {  
//   return axios({
//     // url: '/sys/login',
//     method: 'post',
//     data: parameter
//   })
// }

export function login(parameter) {      //引入uer.js
  return axios({
    url: '/ums/admin/login',
    method: 'post',
    data: parameter,
    // params:parameter,
    headers:{
      'Content-Type':'application/json'
    }
  })
}

export function phoneLogin(parameter) {        //引入uer.js
  return axios({
    // url: '/sys/phoneLogin',
    url: '/ums/admin/login',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha(parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo() {   //定义了为什么不用   //额外引入user.js
  return axios({
    url: '/ums/admin/info',
    method: 'get',
    // data:parameter,  //get请求用data
    // params:parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'Authorization':  loginToken  //不确定
    }
  })
}
export function  queryPermissionsByUser() {  
  return axios({
    url: '/ums/admin/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// export function getInfo(parameter) {  
//   var formData = new FormData()
//   for (const key in parameter) {
//     formData.append(key,parameter[key])
//   }
//   return axios({
//     url: '/ums/admin/info',
//     method: 'get',
//     data: parameter,
//     params:parameter,
//     headers:{
//       'Content-Type':'application/x-www-form-urlencoded'
//     }
//   })
// }

export function logout(logoutToken) {       //引入uer.js
  return axios({
    // url: '/sys/logout',
    url: '/ums/admin/logout',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'X-Access-Token':  logoutToken
      'Authorization':  logoutToken

    }
  })
}

/**
 * 第三方登录
 * @param token
 * @param thirdType
 * @returns {*}
 */
export function thirdLogin(token,thirdType) {         //引入uer.js
  return axios({
    url: `/sys/thirdLogin/getLoginUser/${token}/${thirdType}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 强退其他账号
 * @param token
 * @returns {*}
 */
export function forceLogout(parameter) {
  return axios({
    url: '/sys/online/forceLogout',
    method: 'post',
    data: parameter
  })
}