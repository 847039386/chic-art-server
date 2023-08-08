import { Test, TestingModule } from '@nestjs/testing';
import { ProgressTemplateController } from './progress_template.controller';
import { ProgressTemplateService } from './progress_template.service';

describe('ProgressTemplateController', () => {
  let controller: ProgressTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressTemplateController],
      providers: [ProgressTemplateService],
    }).compile();

    controller = module.get<ProgressTemplateController>(ProgressTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
