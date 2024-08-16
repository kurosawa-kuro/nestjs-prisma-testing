import { Test, TestingModule } from '@nestjs/testing';
import { CategoryTodoService } from '@/app/services/category-todo.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

describe('CategoryTodoService', () => {
  let service: CategoryTodoService;
  let prismaClientService: PrismaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryTodoService,
        {
          provide: PrismaClientService,
          useValue: {
            categoryTodo: {
              create: jest.fn().mockResolvedValue({
                todoId: 1,
                categoryId: 1,
              }),
              delete: jest.fn().mockResolvedValue({
                todoId: 1,
                categoryId: 1,
              }),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoryTodoService>(CategoryTodoService);
    prismaClientService = module.get<PrismaClientService>(PrismaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addTodoToCategory', () => {
    it('should add a todo to a category', async () => {
      const result = await service.addTodoToCategory(1, 1);
      expect(result).toEqual({ todoId: 1, categoryId: 1 });
      expect(prismaClientService.categoryTodo.create).toHaveBeenCalledWith({
        data: { todoId: 1, categoryId: 1 },
      });
    });
  });

  describe('removeTodoFromCategory', () => {
    it('should remove a todo from a category', async () => {
      const result = await service.removeTodoFromCategory(1, 1);
      expect(result).toEqual({ todoId: 1, categoryId: 1 });
      expect(prismaClientService.categoryTodo.delete).toHaveBeenCalledWith({
        where: {
          todoId_categoryId: {
            todoId: 1,
            categoryId: 1,
          },
        },
      });
    });
  });

  describe('getTodosForCategory', () => {
    it('should return todos for a category', async () => {
      const mockTodos = [
        { todoId: 1, categoryId: 1, todo: { id: 1, title: 'Test Todo 1' } },
        { todoId: 2, categoryId: 1, todo: { id: 2, title: 'Test Todo 2' } },
      ];
      (prismaClientService.categoryTodo.findMany as jest.Mock).mockResolvedValue(mockTodos);

      const result = await service.getTodosForCategory(1);
      expect(result).toEqual(mockTodos);
      expect(prismaClientService.categoryTodo.findMany).toHaveBeenCalledWith({
        where: { categoryId: 1 },
        include: { todo: true },
      });
    });
  });

  describe('getCategoriesForTodo', () => {
    it('should return categories for a todo', async () => {
      const mockCategories = [
        { todoId: 1, categoryId: 1, category: { id: 1, title: 'Work' } },
        { todoId: 1, categoryId: 2, category: { id: 2, title: 'Personal' } },
      ];
      (prismaClientService.categoryTodo.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const result = await service.getCategoriesForTodo(1);
      expect(result).toEqual(mockCategories);
      expect(prismaClientService.categoryTodo.findMany).toHaveBeenCalledWith({
        where: { todoId: 1 },
        include: { category: true },
      });
    });
  });
});