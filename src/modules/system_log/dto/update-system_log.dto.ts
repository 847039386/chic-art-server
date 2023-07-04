import { PartialType } from '@nestjs/swagger';
import { CreateSystemLogDto } from './create-system_log.dto';

export class UpdateSystemLogDto extends PartialType(CreateSystemLogDto) {}
