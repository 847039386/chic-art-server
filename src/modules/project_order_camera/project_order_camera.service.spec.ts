import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderCameraService } from './project_order_camera.service';

describe('ProjectOrderCameraService', () => {
  let service: ProjectOrderCameraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectOrderCameraService],
    }).compile();

    service = module.get<ProjectOrderCameraService>(ProjectOrderCameraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
