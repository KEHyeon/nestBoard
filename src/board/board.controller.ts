import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';
import { BoardService } from './board.service';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}
  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardService.create(createBoardDto);
  }
  @Patch('/:id')
  async updateBoard(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.update(parseInt(id), updateBoardDto);
  }
  @Get()
  async findAll() {
    return await this.boardService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.boardService.findOne(parseInt(id));
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() files: Array<Express.Multer.File>) {
    return this.boardService.uploadImg(files);
  }
}
