import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupRoleService } from './user_group_role.service';

describe('UserGroupRoleService', () => {
  let service: UserGroupRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGroupRoleService],
    }).compile();

    service = module.get<UserGroupRoleService>(UserGroupRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
