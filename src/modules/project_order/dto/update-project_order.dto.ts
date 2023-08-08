import { PartialType } from '@nestjs/swagger';
import { CreateProjectOrderDto } from './create-project_order.dto';

export class UpdateProjectOrderDto extends PartialType(CreateProjectOrderDto) {}
