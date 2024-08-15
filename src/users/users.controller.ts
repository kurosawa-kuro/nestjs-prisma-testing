import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { CreateUser, UpdateUser } from './user.model';
import { FileUploadService } from '@/lib/file-upload.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('FileUploadService')
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'The user to be created',
    schema: {
      example: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createUser: CreateUser) {
    return this.usersService.create(createUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [CreateUser],
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  index() {
    return this.usersService.all();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    type: CreateUser,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  show(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.find(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: UpdateUser })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: CreateUser,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UpdateUser,
  ) {
    return this.usersService.update(id, updateUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.destroy(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Upload avatar for a user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The avatar has been successfully uploaded.',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const isValid = this.fileUploadService.validateFile(file);
    if (!isValid) {
      throw new BadRequestException('Only image files are allowed!');
    }

    const filename = this.fileUploadService.generateFilename(file);
    await this.fileUploadService.saveFile(file, filename);

    const avatarUrl = `/uploads/avatars/${filename}`;
    const updatedUser = await this.usersService.updateAvatar(id, avatarUrl);
    return { avatarUrl: updatedUser.avatar };
  }
}
