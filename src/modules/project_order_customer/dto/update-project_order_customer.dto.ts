import { PartialType } from '@nestjs/swagger';
import { CreateProjectOrderCustomerDto } from './create-project_order_customer.dto';

export class UpdateProjectOrderCustomerDto extends PartialType(CreateProjectOrderCustomerDto) {}
