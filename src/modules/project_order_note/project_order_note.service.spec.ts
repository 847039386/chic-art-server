import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderNoteService } from './project_order_note.service';

describe('ProjectOrderNoteService', () => {
  let service: ProjectOrderNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectOrderNoteService],
    }).compile();

    service = module.get<ProjectOrderNoteService>(ProjectOrderNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
