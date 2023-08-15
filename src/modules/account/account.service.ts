import mongoose, { Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateAccountDto ,RegisterDto, WxloginDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './schema/account.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { encryptCredential, makeSalt } from 'src/shared/utils/cryptogram.util';
import baseConfig from 'src/config/base.config';

@Injectable()
export class AccountService {

  constructor(
    @InjectModel('Account') private readonly accountSchema: Model<CreateAccountDto>,
    @InjectModel('User') private readonly userSchema: Model<CreateUserDto>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ) { }

  async findOne(query :any) : Promise<Account>{
    return await this.accountSchema.findOne(query).populate('user_id');
  }

  findByIdAndUpdate(id: number, updateAccountDto: UpdateAccountDto) {
    return this.accountSchema.findByIdAndUpdate(id,updateAccountDto);
  }

  async register (dto :RegisterDto)  {
    let result;
    let session = await this.connection.startSession(); 
    session.startTransaction();
    try {
      // 查看是否账号注册
      let account_isExist = await this.accountSchema.findOne({ identifier :dto.identifier ,identity_type:'username'}).session(session);
      if(account_isExist){
        throw new BaseException(ResultCode.ACCOUNT_USERNAME_REPEAT,{})
      }
      // 如没有注册创建一个用户
      const user_schema = new this.userSchema({ nickname :dto.nickname ,avatar :dto.avatar  })
      const user = await user_schema.save({ session });
      const user_id = user._id
      const salt = makeSalt()
      // 给密码加盐
      const hash_credential = encryptCredential(dto.credential,salt)
      // 创建一个账户
      const account_schema = new this.accountSchema({
        user_id ,
        identity_type :'username' ,
        identifier :dto.identifier,
        credential:hash_credential ,
        salt
      })

      const account = await account_schema.save({ session })

      result = user
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result
  }

  
  async wxLogin (dto :WxloginDto) {
    let result = {};
    const appid = baseConfig.wx.appid;
    const secret = baseConfig.wx.secret;
    const wxapi = baseConfig.wx.api;
    const url = `${wxapi}?appid=${appid}&secret=${secret}&js_code=${dto.code}&grant_type=authorization_code`
    let session = await this.connection.startSession(); 
    session.startTransaction();
    try {
      let wx_response :any = await fetch(url)
      let wx_json = await wx_response.json()
      if(wx_json.errmsg){
        throw new BaseException(ResultCode.ERROR,{},{message :wx_json.errmsg})
      }

      let openid = wx_json.openid
      let session_key = wx_json.session_key

      let account_isExist = await this.accountSchema.findOne({ identifier :openid ,identity_type:'wx'}).populate('user_id').session(session);

      if(account_isExist){
        const user = account_isExist.user_id
        result = Object.assign({tp:'登陆后返回用户信息' ,tp_code:1},JSON.parse(JSON.stringify(user)))
      }else{
        // 不存在则注册
        const salt = makeSalt()
        const user_schema = new this.userSchema({ nickname :dto.nickname ,avatar :dto.avatar  })
        const user = await user_schema.save({ session });
        const user_id = user._id
        const account_schema = new this.accountSchema({
          user_id,
          identity_type :'wx' ,
          identifier :openid,
          credential:openid,
          salt
        })
        const account = await account_schema.save({ session })
        result = Object.assign({tp:'注册后返回用户信息' ,tp_code:0 },JSON.parse(JSON.stringify(user)))
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    } finally{
      await session.endSession();
    }
    return result;
  }

  async wxExist(code :string){
    try {
      const appid = baseConfig.wx.appid;
      const secret = baseConfig.wx.secret;
      const wxapi = baseConfig.wx.api;
      const url = `${wxapi}?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
      let wx_response :any = await fetch(url)
      let wx_json = await wx_response.json()
      if(wx_json.errmsg){
        throw new BaseException(ResultCode.ERROR,{},{message :wx_json.errmsg})
      }
      let openid = wx_json.openid
      return this.accountSchema.findOne({ identifier : openid , identity_type:'wx'})

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
