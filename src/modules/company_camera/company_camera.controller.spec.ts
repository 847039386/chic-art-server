import { Test, TestingModule } from '@nestjs/testing';
import { CompanyCameraController } from './company_camera.controller';
import { CompanyCameraService } from './company_camera.service';

describe('CompanyCameraController', () => {
  let controller: CompanyCameraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyCameraController],
      providers: [CompanyCameraService],
    }).compile();

    controller = module.get<CompanyCameraController>(CompanyCameraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
