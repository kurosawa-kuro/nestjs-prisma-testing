// src/todos/todo_service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { Todo, User } from '@prisma/client';

interface TodoWithUser extends Todo {
  user?: User;
}

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
        { id: 1, title: 'Todo 1', userId: 1, user: {
          id: 1, name: 'User 1', email: 'user1@example.com',
          password: ''
        } },
        { id: 2, title: 'Todo 2', userId: 2, user: {
          id: 2, name: 'User 2', email: 'user2@example.com',
          password: ''
        } },
      ];

      (prismaService.todo.findMany as jest.Mock).mockResolvedValue(mockTodos);

      const result = await service.findAllWithUser();

      expect(result).toEqual(mockTodos);
      expect(prismaService.todo.findMany).toHaveBeenCalledWith({
        include: { user: true },
      });
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const mockTodo: Todo = { id: 1, title: 'New Todo', userId: 1 };

      (prismaService.todo.create as jest.Mock).mockResolvedValue(mockTodo);

      const result = await service.create({ title: 'New Todo', userId: 1 });

      expect(result).toEqual(mockTodo);
      expect(prismaService.todo.create).toHaveBeenCalledWith({
        data: { title: 'New Todo', userId: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('should find a todo by id', async () => {
      const mockTodo: Todo = { id: 1, title: 'Todo 1', userId: 1 };

      (prismaService.todo.findUnique as jest.Mock).mockResolvedValue(mockTodo);

      const result = await service.find(1);

      expect(result).toEqual(mockTodo);
      expect(prismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const mockTodo: Todo = { id: 1, title: 'Updated Todo', userId: 1 };

      (prismaService.todo.update as jest.Mock).mockResolvedValue(mockTodo);

      const result = await service.update(1, { title: 'Updated Todo' });

      expect(result).toEqual(mockTodo);
      expect(prismaService.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Updated Todo' },
      });
    });
  });

  describe('destroy', () => {
    it('should delete a todo', async () => {
      const mockTodo: Todo = { id: 1, title: 'Todo 1', userId: 1 };

      (prismaService.todo.delete as jest.Mock).mockResolvedValue(mockTodo);

      const result = await service.destroy(1);

      expect(result).toEqual(mockTodo);
      expect(prismaService.todo.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('paginate', () => {
    it('should return paginated results', async () => {
      const mockTodos: Todo[] = [
        { id: 1, title: 'Todo 1', userId: 1 },
        { id: 2, title: 'Todo 2', userId: 2 },
      ];

      const mockCount = 2;

      (prismaService.todo.findMany as jest.Mock).mockResolvedValue(mockTodos);
      (prismaService.todo.count as jest.Mock).mockResolvedValue(mockCount);

      const result = await service.paginate(1, 10);

      expect(result.data).toEqual(mockTodos);
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        per_page: 10,
        last_page: 1,
      });
      expect(prismaService.todo.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
      });
      expect(prismaService.todo.count).toHaveBeenCalled();
    });
  });
});