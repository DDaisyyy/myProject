/**
 * 弃用
 */
import { setStore, getStore, clearStore } from "@/utils/storage"

export const TokenKey = 'Access-Token'

export function getToken() {
  return getStore(TokenKey)
}

export function setToken(token) {
  // key, token, timeout = 86400s
  return setStore(TokenKey, token, 86400)
}

export function removeToken() {
  return clearStore(TokenKey)
}

//该文件下封装cookies
// import Cookies from 'js-cookie'

// const TokenKey = 'loginToken'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }