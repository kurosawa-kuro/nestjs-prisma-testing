// src/users/users.service.spec.ts

import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUser, UpdateUser } from './user.model';
import { setupTestModule } from '../../test/test-utils';
import { createMockUser } from '../../test/mock-factories';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService>;

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
      const createUserDto: CreateUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      const mockUser = createMockUser(createUserDto);

      jest.spyOn(prismaService.user, 'create').mockImplementation(() => Promise.resolve(mockUser) as any);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });
  });

  // 他のテストケースも同様にリファクタリング
});