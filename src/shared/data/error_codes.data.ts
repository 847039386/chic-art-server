export class ErrorCodes {
    static ERROR = { code :-1 ,message:"失败"} 
    static SUCCESS = { code :0 ,message:"成功"} 
    // 公共错误
    static COMMON_PARAM_ERROR = { code :20001 ,message:"参数错误"} 
    // 用户模块错误
    static USER_NAME_LIMIT = { code :20101 ,message:"用户名称超出限制"} 
    static USER_NOT_EXISTS = { code :20102 ,message:"用户不存在"} 
    // 账号模块错误
    static ACCOUNT_CREDENTIAL_LIMIT = { code :20201 ,message:"凭证超出限制"} 
    static ACCOUNT_CREDENTIAL_ERROR = { code :20202 ,message:"凭证错误"} 
    static ACCOUNT_VERIFY_CODE_ERROR = { code :20203 ,message:"验证码错误"} 
    static ACCOUNT_MOBILE_REPEAT = { code :20204 ,message:"手机已被注册"} 
    static ACCOUNT_EMAIL_REPEAT = { code :20205 ,message:"邮箱已被注册"} 
    static ACCOUNT_PASSWORD_ERROR = { code :20206 ,message:"密码错误"} 
    static ACCOUNT_PASSWORD_FORMAT_ERROR = { code :20207 ,message:"密码至少包含字母、数字，6-16位"} 
    static ACCOUNT_PASSWORD_DIFF = { code :20209 ,message:"二次密码不一样"} 
    static ACCOUNT_PASSWORD_OLD_ERROR = { code :202010 ,message:"旧密码错误"} 
    static ACCOUNT_USERNAME_FORMAT_ERROR = { code :20211 ,message:"用户名要求字母开头，可包含字母，数字，减号，下划线，6至20位。"} 
    static ACCOUNT_USERNAME_REPEAT = { code :20212 ,message:"用户名已被注册"} 
    static ACCOUNT_USERNAME_NOT = { code :20213 ,message:"用户名不存在"} 
    static ACCOUNT_USERNAME_ERROR = { code :20213 ,message:"用户名错误"} 
    // 验证模块错误
    static AUTH_TOKEN_NOT = { code :20301 ,message:"请先登陆"} 
    static AUTH_TOKEN_ERROR = { code :20302 ,message:"token错误"} 
    static AUTH_TOKEN_EXPIRED = { code :20303 ,message:"token已经过期"} 
    
}

// 