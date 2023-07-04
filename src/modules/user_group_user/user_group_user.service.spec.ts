import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupUserService } from './user_group_user.service';

describe('UserGroupUserService', () => {
  let service: UserGroupUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGroupUserService],
    }).compile();

    service = module.get<UserGroupUserService>(UserGroupUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
