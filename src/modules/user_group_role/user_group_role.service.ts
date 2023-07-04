import { Injectable } from '@nestjs/common';
import { CreateUserGroupRoleDto } from './dto/create-user_group_role.dto';
import { UpdateUserGroupRoleDto } from './dto/update-user_group_role.dto';

@Injectable()
export class UserGroupRoleService {
  create(createUserGroupRoleDto: CreateUserGroupRoleDto) {
    return 'This action adds a new userGroupRole';
  }

  findAll() {
    return `This action returns all userGroupRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userGroupRole`;
  }

  update(id: number, updateUserGroupRoleDto: UpdateUserGroupRoleDto) {
    return `This action updates a #${id} userGroupRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userGroupRole`;
  }
}
