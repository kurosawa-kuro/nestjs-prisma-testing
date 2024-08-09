// src/todos/todos.service.spec.ts

import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { setupTestModule } from '../../test/test-utils';
import { TodoWithUser } from './todo.model';

describe('TodosService', () => {
  let service: TodosService;
  let prismaService: jest.Mocked<
    PrismaService & { todo: jest.MockedFunction<any> }
  >;

  beforeEach(async () => {
    // Using setupTestModule to initialize the service and mock Prisma service
    const { service: todosService, prismaService: mockPrismaService } =
      await setupTestModule(TodosService, 'todo');
    service = todosService;
    prismaService = mockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllWithUser', () => {
    it('should return todos with user information', async () => {
      const mockTodos: TodoWithUser[] = [
        {
          id: 1,
          title: 'Todo 1',
          userId: 1,
          user: {
            id: 1,
            name: 'User 1',
            email: 'user1@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {
          id: 2,
          title: 'Todo 2',
          userId: 2,
          user: {
            id: 2,
            name: 'User 2',
            email: 'user2@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue(mockTodos);

      const result = await service.findAllWithUser();

      expect(result).toEqual(mockTodos);
      expect(prismaService.todo.findMany).toHaveBeenCalledWith({
        include: { user: true },
      });
    });
  });

  // Other test cases would be similarly refactored to use the setupTestModule function
});
