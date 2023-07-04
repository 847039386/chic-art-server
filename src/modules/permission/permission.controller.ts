import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/common/decorators/api.decorator';
import { Types } from 'mongoose';
import { arrayToTree } from 'src/shared/utils/tools.util';

@Controller('api/permission')
@ApiTags('权限接口') 
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('/add')
  // @ApiAmendDecorator({ module :'权限' ,subject:'权限添加' })
  @ApiOperation({ summary: '创建权限', description: '创建一条权限' }) 
  async create(@Body() createPermissionDto: CreatePermissionDto) {

    let permission = {
      name:createPermissionDto.name,
      description:createPermissionDto.description,
      available :true,
      type:createPermissionDto.type,
      code :createPermissionDto.code,
    }

    if(createPermissionDto.parent_id){
      permission = Object.assign(permission,{ parent_id : new Types.ObjectId(createPermissionDto.parent_id) })
    }

    return apiAmendFormat(await this.permissionService.create(permission));
  }

  @Get('/list')
  // @ApiAmendDecorator({ module :'权限' ,subject:'权限查询' })
  @ApiOperation({ summary: '查询权限', description: '查询所有权限，不分页,返回树形结构' }) 
  async findAll() {
    return apiAmendFormat(arrayToTree(await this.permissionService.findAll(),null));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
