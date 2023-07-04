import { Controller, Get, Post, Body,  Delete ,Req ,Param, HttpException ,HttpStatus  } from '@nestjs/common';
import { Request } from 'express'
import { SystemLogService } from './system_log.service';
import { CreateSystemLogDto } from './dto/create-system_log.dto';

@Controller('system-log')
export class SystemLogController {
  constructor(private readonly systemLogService: SystemLogService) {}

  @Post()
  create(@Body() createSystemLogDto: CreateSystemLogDto) {
    // return this.systemLogService.create(createSystemLogDto);
  }

  @Get(':id')
  findAll(@Req() request: Request) {
    return {
      id :1111,
      kkk :2222,
      ttt:231123123
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemLogService.remove(+id);
  }
}


