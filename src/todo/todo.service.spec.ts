import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';

describe('TodoService', () => {
  let service: TodoService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: {
            todo: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodoInput: CreateTodoInput = { title: 'Test Todo' };
      const createdTodo = {
        id: 1,
        title: 'Test Todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.todo, 'create').mockResolvedValue(createdTodo);

      expect(await service.create(createTodoInput)).toEqual(createdTodo);
      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: { title: createTodoInput.title },
      });
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      const todos = [
        {
          id: 1,
          title: 'Test Todo',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(prisma.todo, 'findMany').mockResolvedValue(todos);

      expect(await service.findAll()).toEqual(todos);
      expect(prisma.todo.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const todo = {
        id: 1,
        title: 'Test Todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.todo, 'findUnique').mockResolvedValue(todo);

      expect(await service.findOne(1)).toEqual(todo);
      expect(prisma.todo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoInput: UpdateTodoInput = { id: 1, title: 'Updated Todo' };
      const updatedTodo = {
        id: 1,
        title: 'Updated Todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.todo, 'update').mockResolvedValue(updatedTodo);

      expect(await service.update(1, updateTodoInput)).toEqual(updatedTodo);
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: updateTodoInput.title },
      });
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const removedTodo = {
        id: 1,
        title: 'Test Todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.todo, 'delete').mockResolvedValue(removedTodo);

      expect(await service.remove(1)).toEqual(removedTodo);
      expect(prisma.todo.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
