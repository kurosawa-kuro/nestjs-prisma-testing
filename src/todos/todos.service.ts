import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodo, UpdateTodo } from './todo.model';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  create(CreateTodo: CreateTodo) {
    return this.prisma.todo.create({
      data: CreateTodo,
    });
  }

  findAll() {
    return this.prisma.todo.findMany();
  }

  findOne(id: number) {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  update(id: number, UpdateTodo: UpdateTodo) {
    return this.prisma.todo.update({
      where: { id },
      data: UpdateTodo,
    });
  }

  remove(id: number) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}