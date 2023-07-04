import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/common/decorators/api.decorator';

@Controller('api/permission')
@ApiTags('权限接口') 
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  // @ApiAmendDecorator({ module :'权限' ,subject:'权限添加' })
  @ApiOperation({ summary: '创建权限', description: '创建一条权限' }) 
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  // @ApiAmendDecorator({ module :'权限' ,subject:'权限查询' })
  @ApiOperation({ summary: '查询权限', description: '查询所有权限，不分页，由前端分组，这里只给数据' }) 
  findAll() {
    return this.permissionService.findAll();
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
