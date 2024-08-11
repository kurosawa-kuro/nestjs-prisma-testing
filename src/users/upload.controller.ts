// src/users/upload.controller.ts

import {Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from 'multer';
import {extname} from 'path';
import {Response} from "express";

export function generateRandomFileName(originalName: string): string {
    const randomName = Array(32).fill(null).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return `${randomName}${extname(originalName)}`;
}

@Controller()
export class UploadController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename(_, file, callback) {
                callback(null, generateRandomFileName(file.originalname));
            }
        })
    }))
    uploadFile(@UploadedFile() file) {
        return {
            url: `http://localhost:8080/api/uploads/${file.filename}`
        }
    }

    @Get('uploads/:path')
    async getImage(
        @Param('path') path,
        @Res() res: Response
    ) {
        res.sendFile(path, {root: 'uploads'});
    }
}