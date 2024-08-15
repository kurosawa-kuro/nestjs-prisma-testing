import { Module } from '@nestjs/common';
import { UsersModule } from '@/config/users.module';
import { PrismaModule } from '@/orm/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth.module';
import { TodosModule } from '@/config/todos.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    TodosModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}
