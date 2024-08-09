// src/todos/todos.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodo, UpdateTodo } from './todo.model';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            create: jest.fn(),
            all: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodo: CreateTodo = { userId: 1, title: 'New Todo' };
      const expectedResult = { id: 1, ...createTodo };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createTodo)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createTodo);
    });
  });

  describe('index', () => {
    it('should return an array of todos', async () => {
      const expectedResult = [{ id: 1, userId: 1, title: 'Todo 1' }];

      jest.spyOn(service, 'all').mockResolvedValue(expectedResult);
      expect(await controller.index()).toBe(expectedResult);
      expect(service.all).toHaveBeenCalled();
    });
  });

  describe('show', () => {
    it('should return a todo', async () => {
      const expectedResult = { id: 1, userId: 1, title: 'Todo 1' };

      jest.spyOn(service, 'find').mockResolvedValue(expectedResult);

      expect(await controller.show('1')).toBe(expectedResult);
      expect(service.find).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodo: UpdateTodo = { title: 'Updated Todo' };
      const expectedResult = { id: 1, userId: 1, title: 'Updated Todo' };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update('1', updateTodo)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateTodo);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const expectedResult = { id: 1, userId: 1, title: 'Todo 1' };

      jest.spyOn(service, 'destroy').mockResolvedValue(expectedResult);

      expect(await controller.remove('1')).toBe(expectedResult);
      expect(service.destroy).toHaveBeenCalledWith(1);
    });
  });
});