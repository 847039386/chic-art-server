import { Request } from 'express'
import { randomBytes } from 'crypto'

// 获取requests参数
export const getRequestParams = (request :Request) =>{
    let params = {}
    if(request.method == 'GET'){
        if(Object.keys(request.params).length > 0){
            params = request.params
        }else if(Object.keys(request.query).length > 0){
            params = request.query
        }
    }else{
        params = request.body
    }
    return params
}
/**
 * 深拷贝
 * @param target 源对象
 * @returns 新对象
 */
export function deepClone(target) {
  const map = new WeakMap()
  
  function isObject(target) {
      return (typeof target === 'object' && target ) || typeof target === 'function'
  }

  function clone(data) {
      if (!isObject(data)) {
          return data
      }
      if ([Date, RegExp].includes(data.constructor)) {
          return new data.constructor(data)
      }
      if (typeof data === 'function') {
          return new Function('return ' + data.toString())()
      }
      const exist = map.get(data)
      if (exist) {
          return exist
      }
      if (data instanceof Map) {
          const result = new Map()
          map.set(data, result)
          data.forEach((val, key) => {
              if (isObject(val)) {
                  result.set(key, clone(val))
              } else {
                  result.set(key, val)
              }
          })
          return result
      }
      if (data instanceof Set) {
          const result = new Set()
          map.set(data, result)
          data.forEach(val => {
              if (isObject(val)) {
                  result.add(clone(val))
              } else {
                  result.add(val)
              }
          })
          return result
      }
      const keys = Reflect.ownKeys(data)
      const allDesc = Object.getOwnPropertyDescriptors(data)
      const result = Object.create(Object.getPrototypeOf(data), allDesc)
      map.set(data, result)
      keys.forEach(key => {
          const val = data[key]
          if (isObject(val)) {
              result[key] = clone(val)
          } else {
              result[key] = val
          }
      })
      return result
  }

  return clone(target)
}

// 去重数组
export function uniqueArray (arr) : Array<string>{
    return Array.from(new Set(arr))
}
