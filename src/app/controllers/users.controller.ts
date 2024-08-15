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
    return super.create(createUser);
  }

  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [CreateUser],
  })
  findAll() {
    return super.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    type: CreateUser,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return super.findOne(id);
  }

  @ApiBody({ type: UpdateUser })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: CreateUser,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UpdateUser,
  ) {
    return super.update(id, updateUser as CreateUser);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
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