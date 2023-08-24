import { Body,Controller,Post, UploadedFile,UseInterceptors,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFileDto } from './dto/create-file.dto';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { diskStorage } from 'multer';
import * as mkdirp from 'mkdirp';
import { nanoid } from 'nanoid';
import * as path from 'path';

@Controller('file')
@ApiTags('文件管理')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload_image')
  @ApiOperation({ summary: '上传图片' })
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dest = `public/uploads`;
        mkdirp(dest, function () {
          return cb(null, dest);
        });
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + nanoid();
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    }),
    fileFilter: (req, file, callback) => {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        callback(new Error("请上传图片"), false);
      }
      callback(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  async uploadToLocal(@UploadedFile() file: Express.Multer.File ,@Body() fileInfo: CreateFileDto) {
    try {
      const data = await this.fileService.uploadToLocal(file);
      return apiAmendFormat(data)
    } catch (error) { 
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
  
}