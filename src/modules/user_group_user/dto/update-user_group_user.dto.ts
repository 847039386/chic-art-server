import { PartialType } from '@nestjs/swagger';
import { CreateUserGroupUserDto } from './create-user_group_user.dto';

export class UpdateUserGroupUserDto extends PartialType(CreateUserGroupUserDto) {}
