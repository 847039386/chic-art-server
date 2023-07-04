import { PartialType } from '@nestjs/swagger';
import { CreateUserGroupRoleDto } from './create-user_group_role.dto';

export class UpdateUserGroupRoleDto extends PartialType(CreateUserGroupRoleDto) {}
