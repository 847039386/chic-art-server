import { PartialType } from '@nestjs/swagger';
import { CreateCompanyCameraDto } from './create-company_camera.dto';

export class UpdateCompanyCameraDto extends PartialType(CreateCompanyCameraDto) {}
