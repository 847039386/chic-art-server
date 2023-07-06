
/**
 * 向下查询，获取子对象，不包含他自己
 * @param arr 数据库中的数组数据
 * @param id 要查询的id
 * @returns 返回一个数组，数组里包含该id下所有的子对象
 */
export const sonsTree = (arr, id) => {
    var temp = [],
      lev = 0;
    var forFn = function(arr, id, lev) {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item.parent_id == id) {
          item.lev = lev;
          temp.push(item);
          forFn(arr, item._id, lev + 1);
        }
      }
    };
    forFn(arr, id, lev);
    return temp;
}

/**
 * 向上查询，获取自己以上的所有父级对象，包括他自己
 * @param arr 数据库中的数组对象
 * @param pid 要查找的id
 * @returns 所有父级对象
 */
export const familyTree = (arr, id) => {
    var temp = [];
    var forFn = function(arr, id) {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item._id == id) {
          temp.push(item);
          forFn(arr, item.parent_id);
        }
      }
    };
    forFn(arr, id);
    return temp;
}

/**
 * 返回一个ids数组
 * @param arr 父级对象数组
 * @returns 对象中的id数组
 */
export const getTreeIds = (arr) => {
  let newarr = []
  arr.forEach(item => {
    newarr.push(item._id)
  })
  return newarr
}
  
/**
 * 格式化数据库里的值将该值的所有_id 和prent_id 转成string
 * @param arr 
 * @returns 
 */
export function treeFormat(arr :any []){
    let newarr = arr.concat();
    newarr.map((item) => {
        item.parent_id =  item.parent_id ? item.parent_id.toString() : null       
        item._id =   item._id.toString()
        return item
    })
    return newarr.concat()
}
  
/**
 * @description 构造树型结构数据
 * @param data 数据源
 * @param id id字段 默认id
 * @param parentId 父节点字段，默认parentId
 * @param children 子节点字段，默认children
 * @returns 追加字段后的树
 */
export const handleTree = (
  data: any[],
  id?: string,
  parentId?: string,
  children?: string
): any => {
  if (!Array.isArray(data)) {
    console.warn("data must be an array");
    return [];
  }
  const config = {
    id: id || "id",
    parentId: parentId || "parentId",
    childrenList: children || "children"
  };

  const childrenListMap: any = {};
  const nodeIds: any = {};
  const tree = [];

  for (const d of data) {
    const parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (const d of data) {
    const parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o: Record<string, any>) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
};


