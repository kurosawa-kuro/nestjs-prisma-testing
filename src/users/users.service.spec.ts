// src/users/users.service.spec.ts

import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUser, UpdateUser, User } from './user.model';
import { setupTestModule } from '../../test/test-utils';
import { createMockUser } from '../../test/mock-factories';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService & { user: { create: jest.MockedFunction<any> } }>;

  beforeEach(async () => {
    const { service: userService, prismaService: mockPrismaService } = await setupTestModule(UsersService, 'user');
    service = userService;
    prismaService = mockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUser: CreateUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      const mockUser = createMockUser(createUser);

      jest.spyOn(prismaService.user, 'create').mockImplementation(() => Promise.resolve(mockUser));

      const result = await service.create(createUser);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUser,
      });
    });
  });

  // 他のテストケースも同様にリファクタリング
});