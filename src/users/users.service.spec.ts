import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaClientService } from '@/prisma/prisma-client.service';
import { User, Prisma } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaClientService: PrismaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaClientService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaClientService = module.get<PrismaClientService>(PrismaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const users: User[] = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User 1',
          avatar: null,
          password: 'password123',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User 2',
          avatar: null,
          password: 'password123',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prismaClientService.user.findMany as jest.Mock).mockResolvedValue(users);

      const params: Prisma.UserFindManyArgs = {
        where: { name: 'User' },
        orderBy: [{ name: 'asc' }], // 配列として指定
      };

      const result = await service.findAll(params);
      expect(result).toEqual(users);
      expect(prismaClientService.user.findMany).toHaveBeenCalledWith(params);
    });
  });
});
