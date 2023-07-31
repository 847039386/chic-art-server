import { Body,Controller,Post, UploadedFile,UseInterceptors,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFileDto } from './dto/create-file.dto';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { apiAmendFormat } from 'src/shared/utils/api.util';

@Controller('file')
@ApiTags('文件管理')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file'))
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