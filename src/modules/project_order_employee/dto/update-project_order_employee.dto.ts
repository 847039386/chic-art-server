import { PartialType } from '@nestjs/swagger';
import { CreateProjectOrderEmployeeDto } from './create-project_order_employee.dto';

export class UpdateProjectOrderEmployeeDto extends PartialType(CreateProjectOrderEmployeeDto) {}
