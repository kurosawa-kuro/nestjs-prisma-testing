import { Module } from '@nestjs/common';
import { UsersModule } from '@/config/users.module';
import { PrismaModule } from '@/orm/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth.module';
import { AppController } from '@/app/controllers/app.controller';
import { AppService } from '@/app/services/app.service'; // 追加
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
  controllers: [AppController],
  providers: [AppService], // 追加
})
export class AppModule {}
