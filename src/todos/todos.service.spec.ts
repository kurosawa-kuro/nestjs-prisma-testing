// src/todos/todos.service.spec.ts

import { TodosService } from './todos.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { setupTestModule } from '@test/test-utils';
import { TodoWithUser } from './todo.model';

describe('TodosService', () => {
  let service: TodosService;
  let PrismaClientService: jest.Mocked<
    PrismaClientService & { todo: jest.MockedFunction<any> }
  >;

  beforeEach(async () => {
    // Using setupTestModule to initialize the service and mock Prisma service
    const { service: todosService, PrismaClientService: mockPrismaClientService } =
      await setupTestModule(TodosService, 'todo');
    service = todosService;
    PrismaClientService = mockPrismaClientService;
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
            avatar: '',
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
            avatar: '',
          },
        },
      ];

      jest.spyOn(PrismaClientService.todo, 'findMany').mockResolvedValue(mockTodos);

      const result = await service.findAllWithUser();

      expect(result).toEqual(mockTodos);
      expect(PrismaClientService.todo.findMany).toHaveBeenCalledWith({
        include: { user: true },
      });
    });
  });

  // Other test cases would be similarly refactored to use the setupTestModule function
});
