import { Test, TestingModule } from '@nestjs/testing';
import { OperatorLogController } from './operator_log.controller';
import { OperatorLogService } from './operator_log.service';

describe('OperatorLogController', () => {
  let controller: OperatorLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperatorLogController],
      providers: [OperatorLogService],
    }).compile();

    controller = module.get<OperatorLogController>(OperatorLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
