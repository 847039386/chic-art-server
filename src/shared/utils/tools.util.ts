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


export function arrayToTree(arr, parent) {
    var tree = [];
    arr = treeFormat(arr)
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].parent_id === parent) {
        let node = {}
        let children = arrayToTree(arr, arr[i]._id)
        if(children.length > 0){
            node = Object.assign(arr[i],{ children })
        }else{
            node = arr[i]
        }
        tree.push(node);
      }
    }
    return tree;
}


function treeFormat(arr :[any]){
    let newarr = arr;
    return newarr.map((item) => {
        item.parent_id =  item.parent_id ? item.parent_id.toString() : null       
        item._id =   item._id.toString()
        return item
    })
}
  
function findParent(data, target, result) {
    for (let item of data) {
      if (item.id === target.id) {
        //将查找到的目标数据加入结果数组中
        //可根据需求unshift(item.id)或unshift(item)
        result.unshift(item.label)
        return true
      }
      if (item.children && item.children.length > 0) {
        //根据查找到的结果往上找父级节点
        let isFind = findParent(item.children, target, result)
        if (isFind) {
          result.unshift(item.label)
          return true
        }
      }
    }
    //走到这说明没找到目标
    return false
}