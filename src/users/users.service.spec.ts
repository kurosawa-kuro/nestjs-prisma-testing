// src/users/users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserWithPassword } from './user.model';

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

  describe('paginate', () => {
    it('should return paginated results without password', async () => {
      const mockUsers: User[] = [
        {
            id: 1, name: 'User 1', email: 'user1@example.com',
            password: ''
        },
        {
            id: 2, name: 'User 2', email: 'user2@example.com',
            password: ''
        },
      ];

      const mockCount = 2;

      (prismaService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prismaService.user.count as jest.Mock).mockResolvedValue(mockCount);

      const result = await service.paginate(1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.data[0]).not.toHaveProperty('password');
      expect(result.data[1]).not.toHaveProperty('password');
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        per_page: 10,
        last_page: 1,
      });
    });
  });

  describe('find', () => {
    it('should find a user by id', async () => {
      const mockUser: UserWithPassword = { id: 1, name: 'User 1', email: 'user1@example.com', password: 'password1' };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.find(1);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findBy', () => {
    it('should find a user by condition', async () => {
      const mockUser: UserWithPassword = { id: 1, name: 'User 1', email: 'user1@example.com', password: 'password1' };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findBy({ email: 'user1@example.com' });

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({ where: { email: 'user1@example.com' } });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockUser: UserWithPassword = { id: 1, name: 'New User', email: 'newuser@example.com', password: 'password' };

      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create({ name: 'New User', email: 'newuser@example.com', password: 'password' });

      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { name: 'New User', email: 'newuser@example.com', password: 'password' },
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const mockUser: UserWithPassword = { id: 1, name: 'Updated User', email: 'user1@example.com', password: 'password1' };

      (prismaService.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.update(1, { name: 'Updated User' });

      expect(result).toEqual(mockUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated User' },
      });
    });
  });

  describe('destroy', () => {
    it('should delete a user', async () => {
      const mockUser: UserWithPassword = { id: 1, name: 'User 1', email: 'user1@example.com', password: 'password1' };

      (prismaService.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.destroy(1);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});