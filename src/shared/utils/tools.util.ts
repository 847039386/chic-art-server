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
        // var node = {
        //   _id: arr[i]._id,
          
        //   children: arrayToTree(arr, arr[i]._id)
        // };
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
        console.log(item)
        return item
    })
}
  