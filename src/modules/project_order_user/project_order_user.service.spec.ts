import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderUserService } from './project_order_user.service';

describe('ProjectOrderUserService', () => {
  let service: ProjectOrderUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectOrderUserService],
    }).compile();

    service = module.get<ProjectOrderUserService>(ProjectOrderUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
