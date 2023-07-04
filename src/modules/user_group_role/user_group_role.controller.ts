import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserGroupRoleService } from './user_group_role.service';
import { CreateUserGroupRoleDto } from './dto/create-user_group_role.dto';
import { UpdateUserGroupRoleDto } from './dto/update-user_group_role.dto';

@Controller('user-group-role')
export class UserGroupRoleController {
  constructor(private readonly userGroupRoleService: UserGroupRoleService) {}

  @Post()
  create(@Body() createUserGroupRoleDto: CreateUserGroupRoleDto) {
    return this.userGroupRoleService.create(createUserGroupRoleDto);
  }

  @Get()
  findAll() {
    return this.userGroupRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userGroupRoleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserGroupRoleDto: UpdateUserGroupRoleDto) {
    return this.userGroupRoleService.update(+id, updateUserGroupRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userGroupRoleService.remove(+id);
  }
}
