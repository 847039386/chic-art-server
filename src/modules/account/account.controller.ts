import { Controller, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { AccountService } from './account.service';
import { apiAmendFormat } from 'src/common/decorators/api.decorator';
import { ApiTags ,ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { OperatorException ,ResultCode ,BaseException } from 'src/shared/utils/base_exception.util';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { encryptCredential } from 'src/shared/utils/cryptogram.util';
import { AuthService } from '../auth/auth.service';
import { Types} from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@Controller('api/account')
@ApiTags('账户接口') 
export class AccountController {
  constructor(private readonly accountService: AccountService ,private readonly authService :AuthService) {}
 
  /**
   * 这里用的jwt策略 会自动返回req.user字段储存用户信息
   * 为了防止伪造token，去通过修改别人的数据。
   * 这里用token里的信息
   */
  @Patch('/up_password')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '修改密码'}) 
  @ApiBody({type : UpdatePasswordDto})
  async updatePassword(@Body() body :UpdatePasswordDto ,@Request() req){
     let user_id = req.user.id;
     let identifier = body.identifier
     let credential = body.credential;
     let r_credential = body.r_credential;
     let o_credential = body.o_credential;
     var credentialPattern = /^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/;
     let hash_credential;
     let oldHashedPassword;
     let newAccount;
     try {
      
      if(credential != r_credential){
        throw new BaseException(ResultCode.ACCOUNT_PASSWORD_DIFF,{})
      }
      if(!credentialPattern.test(credential)){
        throw new BaseException(ResultCode.ACCOUNT_PASSWORD_FORMAT_ERROR,{})
      }
      let oldAccount = await this.accountService.findOne({user_id :new Types.ObjectId(user_id) ,identity_type:'username'})
      if(oldAccount && oldAccount._id){
        let salt = oldAccount.salt
        if(oldAccount.identifier != identifier){
          throw new BaseException(ResultCode.ACCOUNT_USERNAME_ERROR,{})
        }

        oldHashedPassword =  encryptCredential(o_credential,salt)
        if(oldHashedPassword != oldAccount.credential){
          throw new BaseException(ResultCode.ACCOUNT_PASSWORD_OLD_ERROR,{})
        }

        hash_credential = encryptCredential(credential,salt)
        newAccount = await this.accountService.findByIdAndUpdate(oldAccount._id,{ credential:hash_credential  })

        return apiAmendFormat({ 
          name :oldAccount.user_id.name,
          avatar : oldAccount.user_id.avatar
        },{
          isSaveOperator :true,
          operator:{
            user_id:oldAccount.user_id._id,
            type :'修改',
            module:'账户',
            subject:'密码',
            description:'修改了密码'
          }
        })
        
      }else{
        throw new BaseException(ResultCode.ACCOUNT_USERNAME_NOT,{})
      }
    } catch (error) {
      throw new OperatorException(ResultCode.ERROR,{ user_id ,operatorType:'修改' ,module:'账户' ,subject:'密码' ,description:`修改密码失败`},{ isSaveOperator:true },error)
    } 
  }

}
