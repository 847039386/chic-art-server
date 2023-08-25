import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderNoteController } from './project_order_note.controller';
import { ProjectOrderNoteService } from './project_order_note.service';

describe('ProjectOrderNoteController', () => {
  let controller: ProjectOrderNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectOrderNoteController],
      providers: [ProjectOrderNoteService],
    }).compile();

    controller = module.get<ProjectOrderNoteController>(ProjectOrderNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
