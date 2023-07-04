import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserGroupUserService } from './user_group_user.service';
import { CreateUserGroupUserDto } from './dto/create-user_group_user.dto';
import { UpdateUserGroupUserDto } from './dto/update-user_group_user.dto';

@Controller('user-group-user')
export class UserGroupUserController {
  constructor(private readonly userGroupUserService: UserGroupUserService) {}

  @Post()
  create(@Body() createUserGroupUserDto: CreateUserGroupUserDto) {
    return this.userGroupUserService.create(createUserGroupUserDto);
  }

  @Get()
  findAll() {
    return this.userGroupUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userGroupUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserGroupUserDto: UpdateUserGroupUserDto) {
    return this.userGroupUserService.update(+id, updateUserGroupUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userGroupUserService.remove(+id);
  }
}
