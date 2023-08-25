import { PartialType } from '@nestjs/swagger';
import { CreateProjectOrderNoteDto } from './create-project_order_note.dto';

export class UpdateProjectOrderNoteDto extends PartialType(CreateProjectOrderNoteDto) {}
