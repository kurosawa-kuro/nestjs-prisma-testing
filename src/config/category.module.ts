// src/category/category.module.ts
import { Module } from '@nestjs/common';
import { CategoryController } from '@/app/controllers/category.controller';
import { CategoryService } from '@/app/services/category.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaClientService],
  exports: [CategoryService],
})
export class CategoryModule {}