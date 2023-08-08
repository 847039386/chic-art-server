import { Test, TestingModule } from '@nestjs/testing';
import { ProgressTemplateService } from './progress_template.service';

describe('ProgressTemplateService', () => {
  let service: ProgressTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgressTemplateService],
    }).compile();

    service = module.get<ProgressTemplateService>(ProgressTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
