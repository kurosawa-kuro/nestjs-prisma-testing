import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodo, UpdateTodo } from './todo.model';
import { NotFoundException } from '@nestjs/common';

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
      const createTodo: CreateTodo = { title: 'New Todo', userId: 1 };
      const expectedResult = { id: 1, ...createTodo };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createTodo)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createTodo);
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const expectedResult = [{ id: 1, title: 'Todo 1', userId: 1 }];

      jest.spyOn(service, 'all').mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a todo', async () => {
      const expectedResult = { id: 1, title: 'Todo 1', userId: 1 };

      jest.spyOn(service, 'find').mockResolvedValue(expectedResult);

      expect(await controller.findOne(1)).toBe(expectedResult);
      expect(service.find).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if todo is not found', async () => {
      jest.spyOn(service, 'find').mockResolvedValue(null);

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodo: UpdateTodo = { title: 'Updated Todo' };
      const expectedResult = { id: 1, title: 'Updated Todo', userId: 1 };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update(1, updateTodo)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateTodo);
    });

    it('should throw NotFoundException if todo is not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);

      await expect(controller.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const deletedTodo = { id: 1, title: 'Todo 1', userId: 1 };
      const expectedResult = { message: 'Todo successfully deleted' };

      jest.spyOn(service, 'destroy').mockResolvedValue(deletedTodo);

      expect(await controller.remove(1)).toEqual(expectedResult);
      expect(service.destroy).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if todo is not found', async () => {
      jest.spyOn(service, 'destroy').mockResolvedValue(null);

      await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
