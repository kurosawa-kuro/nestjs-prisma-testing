import { Module } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UsersController } from '@/users/users.controller';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileUploadService } from '@/lib/file-upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaClientService,
    {
      provide: 'FileUploadService',
      useClass: FileUploadService,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
