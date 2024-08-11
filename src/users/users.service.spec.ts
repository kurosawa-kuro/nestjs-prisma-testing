// src/users/users.service.spec.ts

import { UsersService } from '@/users/users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUser } from '@/users/user.model';
import { User } from '@/lib/types';
import { setupTestModule } from '../../test/test-utils';
import { createMockUser } from '../../test/mock-factories';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<
    PrismaService & {
      user: {
        create: jest.MockedFunction<any>;
        findMany: jest.MockedFunction<any>;
        count: jest.MockedFunction<any>;
      };
    }
  >;

  beforeEach(async () => {
    const { service: userService, prismaService: mockPrismaService } =
      await setupTestModule(UsersService, 'user');
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

      jest
        .spyOn(prismaService.user, 'create')
        .mockImplementation(() => Promise.resolve(mockUser));

      const result = await service.create(createUser);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUser,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe('all', () => {
    it('should return all users without passwords', async () => {
      const users: User[] = [
        createMockUser({
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        createMockUser({
          id: 2,
          name: 'Jane Doe',
          email: 'jane@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const result = await service.all();

      expect(result).toEqual(users);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe('paginate', () => {
    it('should return paginated user results', async () => {
      const users: User[] = [
        createMockUser({ id: 1, name: 'John Doe', email: 'john@example.com' }),
        createMockUser({ id: 2, name: 'Jane Doe', email: 'jane@example.com' }),
      ];

      const page = 1;
      const perPage = 15;
      const totalUsers = 2;

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);
      jest.spyOn(prismaService.user, 'count').mockResolvedValue(totalUsers);

      const result = await service.paginate(page, perPage);

      expect(result.data).toEqual(users);
      expect(result.meta).toEqual({
        total: totalUsers,
        page: page,
        per_page: perPage,
        last_page: Math.ceil(totalUsers / perPage),
      });
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        take: perPage,
        skip: (page - 1) * perPage,
      });
      expect(prismaService.user.count).toHaveBeenCalled();
    });
  });

  // Any additional test cases would be placed here.
});
