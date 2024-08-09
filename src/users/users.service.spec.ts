// src/users/users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUser, User, UserWithPassword } from './user.model';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
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

      const mockUser: UserWithPassword = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });
  });

  describe('all', () => {
    it('should return all users', async () => {
      const mockUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', createdAt: new Date(), updatedAt: new Date() },
      ];

      (prismaService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await service.all();

      expect(result).toEqual(mockUsers);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should find a user by id', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.find(1);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('findBy', () => {
    it('should find a user by condition', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findBy({ email: 'john@example.com' });

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });
  });

  describe('where', () => {
    it('should return users matching condition', async () => {
      const mockUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', createdAt: new Date(), updatedAt: new Date() },
      ];

      (prismaService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await service.where({ name: 'Doe' });

      expect(result).toEqual(mockUsers);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: { name: 'Doe' },
      });
    });
  });

  describe('paginate', () => {
    it('should return paginated users', async () => {
      const mockUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', createdAt: new Date(), updatedAt: new Date() },
      ];

      const mockCount = 10;
      const page = 1;
      const perPage = 2;

      (prismaService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prismaService.user.count as jest.Mock).mockResolvedValue(mockCount);

      const result = await service.paginate(page, perPage);

      expect(result).toEqual({
        data: mockUsers,
        meta: {
          total: mockCount,
          page: page,
          per_page: perPage,
          last_page: Math.ceil(mockCount / perPage),
        },
      });

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        take: perPage,
        skip: (page - 1) * perPage,
      });

      expect(prismaService.user.count).toHaveBeenCalled();
    });
  });
});