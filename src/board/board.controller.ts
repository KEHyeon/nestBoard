import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';
import { BoardService } from './board.service';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils';

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

  @Get('/image/:id')
  async getImageList(@Param('id') id: string) {
    return await this.boardService.getImages(parseInt(id));
  }

  @Get('/image/detail/:id')
  async getImageDetail(@Param('id') id: string) {
    return await this.boardService.getOneImage(parseInt(id));
  }

  @Post('/image/:id')
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions('board')))
  uploadFile(
    @Param('id') id: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.boardService.uploadImg(parseInt(id), images);
  }
}
