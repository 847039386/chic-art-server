import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderCameraController } from './project_order_camera.controller';
import { ProjectOrderCameraService } from './project_order_camera.service';

describe('ProjectOrderCameraController', () => {
  let controller: ProjectOrderCameraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectOrderCameraController],
      providers: [ProjectOrderCameraService],
    }).compile();

    controller = module.get<ProjectOrderCameraController>(ProjectOrderCameraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
