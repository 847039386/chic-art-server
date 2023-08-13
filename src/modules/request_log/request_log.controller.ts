import { Controller, Get, UseGuards ,Delete ,Query ,Request ,Body,Post } from '@nestjs/common';
import { ApiTags ,ApiOperation ,ApiQuery, ApiBearerAuth} from '@nestjs/swagger';
import { RequestLogService } from './request_log.service';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util'
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@Controller('api/request-log')
@ApiTags('请求日志接口') 
export class RequestLogController {
  constructor(private readonly requestLogService: RequestLogService) {}


  @Get('/list')
  @ApiQuery({ name: 'limit', description:'每页数量'})
  @ApiQuery({ name: 'page' ,description:'当前页数'})
  @ApiOperation({ summary: '请求日志列表', description: '获取所有请求日志，带分页' }) 
  async findAll(@Query() query ) {
    try {
      let page = 1;
      let limit = 10;
      page = Number(query.page) || 1
      limit = Number(query.limit) || 10
      let data = await this.requestLogService.findAll(page,limit);
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('/cleared')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '清空请求日志', description: '清空所有请求日志，操作不可逆' }) 
  async cleared(@Request() req) {
    try {
      let user_id = req.user.id
      return apiAmendFormat(await this.requestLogService.cleared(),{
        isSaveOperator:true,
        operator:{
          user_id,
          type :'清空',
          module:'日志',
          subject:'请求日志',
          description:'清空请求日志所有数据'
        }
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
