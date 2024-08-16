// src/category/category.module.ts
import { Module } from '@nestjs/common';
import { CategoriesController } from '@/app/controllers/categories.controller';
import { CategoriesService } from '@/app/services/categories.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaClientService],
  exports: [CategoriesService],
})
export class CategoryModule {}
