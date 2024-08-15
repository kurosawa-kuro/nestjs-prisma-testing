import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth.module';
import { AppController } from '../controllers/app.controller';
import { AppService } from '@/app/services/app.service'; // 追加
import { TodosModule } from './todos.module';

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
