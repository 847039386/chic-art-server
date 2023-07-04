// 不需要token
export const baseRouter = [

    '/api/auth/refresh-token',   //刷新token
    '/api/auth/login',   //登陆
    '/api/auth/register',   //注册
]

// 需要token 
export const verifyRouter = [

    '/api/request-log/list',        //请求日志
    '/api/request-log/cleared',     //删除所有请求日志


    '/api/operator-log/list',       // 操作日志
    '/api/operator-log/cleared',    //删除所有操作日志
]

// 所有router
export const allRouter = baseRouter.concat(verifyRouter);