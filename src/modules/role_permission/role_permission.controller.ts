import { Controller, Get, Post, Body, Query, Param, Delete } from '@nestjs/common';
import { RolePermissionService } from './role_permission.service';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { ApiOperation, ApiParam, ApiTags ,ApiQuery } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { PermissionService } from '../permission/permission.service';
import { sonsTree ,familyTree ,treeFormat, getTreeIds } from 'src/shared/utils/tree.util';

@Controller('api/role-permission')
@ApiTags('角色权限接口') 
export class RolePermissionController {

  constructor(private readonly rolePermissionService: RolePermissionService ,private readonly permissionService :PermissionService) {}

  @Post('add')
  @ApiOperation({ summary: '给角色添加权限', description: '给角色添加一条权限，一个角色有多条权限' }) 
  async create(@Body() dto: CreateRolePermissionDto) {
    try {
      
      if(!dto.permission_id || !dto.role_id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      
      if(await this.rolePermissionService.isExist(dto)){
        throw new BaseException(ResultCode.ROLE_PERMISSION_IS_EXIST,{})
      }else{
        // 获取所有的权限列表
        let result = treeFormat(await this.permissionService.findAll())
        // 获取角色下所有的权限
        let permissions = await this.rolePermissionService.getPermissionByRoleId(dto.role_id)
        // 1、先向上寻找这条权限的父级成员，父级拥有子集权限，所以当添加权限的父级已被添加时，不允许添加
        let family =  familyTree(result,dto.permission_id)
        // 循环该权限的父级成员，第一位1是他自己
        for (let index = 1; index < family.length; index++) {
          // 循环该角色下的所有权限
          for (let jindex = 0; jindex < permissions.length; jindex++) {
              // 当添加的权限的父级已经被添加时，不允许用户添加这条权限
              if(family[index]._id == permissions[jindex].permission_id.toString()){
                throw new BaseException(ResultCode.ROLE_PERMISSION_IS_EXIST_PARENT,{})
              }            
          }
        }
        // 2、向下查询这条权限的子集、当已经添加的权限是新添加权限子集的时候，删除该权限下所有的子集并添加他
        let children = sonsTree(result,dto.permission_id)
        // 上面的代码获取该条权限所有的子集返回object[],而ids是一个数组包括上面数据里所有id值，如['id1','id2']
        let ids = getTreeIds(children)
        if(ids.length > 0){
          // 当ids，也就是添加的这条权限有子集的时候，删除他们，虽然ids包含多个可能不存在的值，但是deleteMany会过滤他们
          await this.rolePermissionService.deletePermissionIds(dto.role_id,ids)
        }
        // 如果以上都通过的话则创建这条权限
        return apiAmendFormat(await this.rolePermissionService.create(dto));
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
  

  @Delete('del')
  @ApiQuery({ name :'id' , description:'角色权限的id' })
  @ApiOperation({ summary: '删除角色的权限', description: '删除角色的一条权限，一个用户有多条权限，该删除只删除一条权限' }) 
  async remove(@Query('id') id: string) {
    try {
      return apiAmendFormat(await this.rolePermissionService.remove(id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('permissions')
  @ApiQuery({ name :'role_id' , description:'角色id' })
  @ApiOperation({ summary: '角色拥有的权限', description: '根据角色ID查询角色下所有的权限' }) 
  async findAll(@Query('role_id') role_id: string) {
    try {
      return apiAmendFormat(await this.rolePermissionService.getPermissionByRoleId(role_id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
