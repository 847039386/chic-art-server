export default {

    host:'http://192.168.3.9',

    port :3000,

    database : {

    },

    secret: 'secretKeyXXXX',

    token_expiresIn :'30 days',

    wx :{
        appid :'wx4855c4eebbc9ea45',
        secret :'2caa25223b636de271b17b2845e0a364',
        api :'https://api.weixin.qq.com/sns/jscode2session'
    },

    OSS : {
        qiniu:{
            Bucket:'chic-art',  //七牛空间名
            Host:'http://rydz0wlis.hb-bkt.clouddn.com', // 七牛的CDN域名，它加图片路径返回图片地址
            AccessKey:'01oKerp-WnA-ou7DANLaWuSHdKuhk2xInjJ40BxR',
            SecretKey:'ivC4BvoVljlkNmR4HdTQV84jSuXna97Kz8siWoSU'
        }
    }
}