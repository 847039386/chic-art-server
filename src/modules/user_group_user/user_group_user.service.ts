import { Injectable } from '@nestjs/common';
import { CreateUserGroupUserDto } from './dto/create-user_group_user.dto';
import { UpdateUserGroupUserDto } from './dto/update-user_group_user.dto';

@Injectable()
export class UserGroupUserService {
  create(createUserGroupUserDto: CreateUserGroupUserDto) {
    return 'This action adds a new userGroupUser';
  }

  findAll() {
    return `This action returns all userGroupUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userGroupUser`;
  }

  update(id: number, updateUserGroupUserDto: UpdateUserGroupUserDto) {
    return `This action updates a #${id} userGroupUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} userGroupUser`;
  }
}
