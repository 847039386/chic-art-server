export class ResultCode {
    static ERROR = { code :-1 ,message:"失败"} 
    static SUCCESS = { code :0 ,message:"成功"} 
    // 公共错误
    static COMMON_PARAM_ERROR = { code :20001 ,message:"参数错误"} 
    // 用户模块错误
    static USER_NOT_EXISTS = { code :20101 ,message:"用户不存在"} 
    static USER_NAME_VERIFY = { code :20102 ,message:"姓名应是中文姓名2-5位或英文名称2-16位"} 
    static USER_PHONE_VERIFY = { code :20103 ,message:"请输入正确的手机号或固定电话"} 
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
    // 权限
    static PERMISSION_NO = { code :20401 ,message:"无权访问"} 
    static PERMISSION_PARENT_IS_CLOSE = { code :20402 ,message:"当前父级权限是关闭的"} 
    // 角色权限
    static ROLE_PERMISSION_IS_EXIST = { code :20501 ,message:"角色已拥有该权限"} 
    static ROLE_PERMISSION_IS_EXIST_PARENT = { code :20502 ,message:"角色已拥有该权限的父级"} 
    // 用户组
    static USER_GROUP_BAN_PARENT_ADD_ROLE = { code :20601 ,message:"用户组禁止父级添加角色"} 
    // 用户组角色
    static USER_GROUP_ROLE_IS_EXIST = { code :20701 ,message:"用户组已拥有该角色"} 
    // 用户组用户
    static USER_GROUP_USER_IS_EXIST = { code :20801 ,message:"用户已加入该用户组"} 
    static USER_GROUP_USER_IS_EXIST_PARENT = { code :20802 ,message:"用户已加入了该用户组的父级"} 
    // 标签
    static TAG_IS_EXIST = { code :20901 ,message:"标签名称重复"} 
    // 公司
    static COMPANY_IS_EXIST = { code :21001 ,message:"公司名称已被注册"} 
    static COMPANY_USER_IS_EXIST = { code :21002 ,message:"每个用户只允许注册一家公司"} 
    // 公司员工
    static COMPANY_EMPLOYEE_GROUPNAME_LIMIT = { code :21101 ,message:"分组名称超出闲置，应至少为1-16位"} 
}


