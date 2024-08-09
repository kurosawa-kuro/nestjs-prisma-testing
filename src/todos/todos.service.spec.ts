// src/todos/todo_service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { Todo, User } from '@prisma/client';
import { TodoWithUser } from 'src/todos/todo.model';

describe('TodosService', () => {
  let service: TodosService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: {
            todo: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllWithUser', () => {
    it('should return todos with user information', async () => {
      const mockTodos: TodoWithUser[] = [
        { 
          id: 1, title: 'Todo 1', userId: 1, 
          user: {
            id: 1, name: 'User 1', email: 'user1@example.com',
            createdAt: new Date(), updatedAt: new Date()
          } 
        },
        { 
          id: 2, title: 'Todo 2', userId: 2, 
          user: {
            id: 2, name: 'User 2', email: 'user2@example.com',
            createdAt: new Date(), updatedAt: new Date()
          } 
        },
      ];

      (prismaService.todo.findMany as jest.Mock).mockResolvedValue(mockTodos);

      const result = await service.findAllWithUser();

      expect(result).toEqual(mockTodos);
      expect(prismaService.todo.findMany).toHaveBeenCalledWith({
        include: { user: true },
      });
    });
  });

  // その他のテストケース
});
