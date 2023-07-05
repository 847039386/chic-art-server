import { Controller, Get, Post, Body, Patch, Param, Delete ,Query, UseGuards ,Request } from '@nestjs/common';
import { OperatorLogService } from './operator_log.service';
import { CreateOperatorLogDto } from './dto/create-operator_log.dto';
import { UpdateOperatorLogDto } from './dto/update-operator_log.dto';
import { apiAmendFormat} from 'src/common/decorators/api.decorator';
import { ApiTags ,ApiOperation,ApiQuery ,ApiBearerAuth} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BaseException ,ResultCode} from 'src/shared/utils/base_exception.util';

@ApiBearerAuth()
@Controller('api/operator-log')
@ApiTags('操作日志接口')

export class OperatorLogController {
  constructor(private readonly operatorLogService: OperatorLogService) {}

  @Get('/list')
  @ApiQuery({ name: 'limit', description:'每页数量'})
  @ApiQuery({ name: 'page' ,description:'当前页数'})
  @ApiOperation({ summary: '操作日志列表', description: '获取所有操作日志，带分页' }) 
  async findAll(@Query() query) {
    let page = 1;
    let limit = 10;
    page = Number(query.page) || 1
    limit = Number(query.limit) || 10
    let data =  await this.operatorLogService.findAll(page,limit);
    return apiAmendFormat(data,{
      isTakeResponse :false,
    })
  }

   
  @Delete('/cleared')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '清空操作日志', description: '清空所有操作日志，操作不可逆' }) 
  async cleared(@Request() req) {
    try {
      let user_id = req.user.id
      console.log(user_id)
      return apiAmendFormat(await this.operatorLogService.cleared(),{
        isSaveOperator:true,
        operator:{
          user_id,
          type :'清空',
          module:'日志',
          subject:'操作日志',
          description:'清空请求日志所有数据'
        }
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
