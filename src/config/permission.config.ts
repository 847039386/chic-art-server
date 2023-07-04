class PermissionConfig {
    static USER_MENUS;
    static USER_MENU_GET_INFO;
    static USER_MENU_LIST_ALL;
    static USER_MENU_DELETE_INFO;
    static USER_MENU_ADD_INFO;
    static USER_MENU_UPDATE_INFO;
    
}

PermissionConfig.USER_MENUS                  = { code : 'USER_MENUS' , type:'MENU' ,description :'用户管理'  }
PermissionConfig.USER_MENU_GET_INFO          = { code : 'USER_MENU_GET_INFO' , type:'MENU' ,description :'查看用户详情'  }
PermissionConfig.USER_MENU_LIST_ALL          = { code : 'USER_MENU_LIST_ALL' , type:'MENU' ,description :'查看用户列表'  }
PermissionConfig.USER_MENU_ADD_INFO          = { code : 'USER_MENU_ADD_INFO' , type:'MENU' ,description :'添加用户信息'  }
PermissionConfig.USER_MENU_UPDATE_INFO       = { code : 'USER_MENU_UPDATE_INFO' , type:'MENU' ,description :'修改用户信息'  }
PermissionConfig.USER_MENU_DELETE_INFO       = { code : 'USER_MENU_DELETE_INFO' , type:'MENU', description :'删除用户信息'  }

