import { PartialType } from '@nestjs/swagger';
import { CreateProjectOrderCameraDto } from './create-project_order_camera.dto';

export class UpdateProjectOrderCameraDto extends PartialType(CreateProjectOrderCameraDto) {}
