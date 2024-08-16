import { Module } from '@nestjs/common';
import { PrismaModule } from '@/orm/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from '@/config/users.module';
import { AuthModule } from '@/config/auth.module';
import { TodosModule } from '@/config/todos.module';
import { CategoryModule } from '@/config/category.module';
import { CategoryTodoModule } from './category-todo.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    TodosModule,
    CategoryModule,
    CategoryTodoModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}
