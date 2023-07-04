import { PartialType } from '@nestjs/swagger';
import { CreateOperatorLogDto } from './create-operator_log.dto';

export class UpdateOperatorLogDto extends PartialType(CreateOperatorLogDto) {}
