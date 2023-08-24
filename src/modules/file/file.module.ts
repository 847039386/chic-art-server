//file.module.ts
import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as mkdirp from 'mkdirp';
import { nanoid } from 'nanoid';
import * as path from 'path';




@Module({
  imports:[
    // MulterModule.registerAsync({
    //   useFactory: async () => ({
    //     storage: diskStorage({
    //       destination: (req, file, cb) => {
    //         const dest = `public/uploads`;
    //         mkdirp(dest, function () {
    //           return cb(null, dest);
    //         });
    //       },
    //       filename: (req, file, cb) => {
    //         const uniqueSuffix = Date.now() + '-' + nanoid();
    //         cb(null, uniqueSuffix + path.extname(file.originalname));
    //       },
    //     }),
    //   }),
    // }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}