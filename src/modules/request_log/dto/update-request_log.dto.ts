import { PartialType } from '@nestjs/swagger';
import { CreateRequestLogDto } from './create-request_log.dto';

export class UpdateRequestLogDto extends PartialType(CreateRequestLogDto) {}
