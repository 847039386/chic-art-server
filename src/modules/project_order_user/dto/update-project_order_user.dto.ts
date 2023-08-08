import { PartialType } from '@nestjs/swagger';
import { CreateProjectOrderUserDto } from './create-project_order_user.dto';

export class UpdateProjectOrderUserDto extends PartialType(CreateProjectOrderUserDto) {}
