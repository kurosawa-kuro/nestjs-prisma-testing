import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Inject,
  Param,
  ParseIntPipe,
  Body,
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

import { UsersService } from '@/app/services/users.service';
import { CreateUser, UpdateUser } from '@/app/models/user.model';
import { FileUploadService } from '@/lib/file-upload.service';
import { BaseController } from '@/lib/base.controller';

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController<CreateUser> {
  constructor(
    private readonly usersService: UsersService,
    @Inject('FileUploadService')
    private readonly fileUploadService: FileUploadService,
  ) {
    super(usersService, 'User');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUser,
    description: 'User creation data',
    examples: {
      user: {
        summary: 'New user example',
        value: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!',
        },
      },
    },
  })
  create(@Body() createUser: CreateUser) {
    return super.create(createUser);
  }

  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return super.findAll();
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return super.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({
    type: UpdateUser,
    description: 'User update data',
    examples: {
      user: {
        summary: 'Update user example',
        value: {
          name: 'John Updated',
          email: 'john.updated@example.com',
        },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UpdateUser,
  ) {
    return super.update(id, updateUser as CreateUser);
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return super.remove(id);
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