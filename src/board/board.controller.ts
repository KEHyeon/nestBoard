import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateBoardDto } from './dtos/board/create-board.dto';
import { BoardService } from './board.service';
import { UpdateBoardDto } from './dtos/board/update-board.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils';
import { BoardIntercepter } from './intercepters/Board.intercepter';
import { Paginate, PaginateQuery } from 'nestjs-paginate/lib/decorator';
import { CreateCommentDto } from './dtos/comment/create-comment.dto';
import { CommentService } from './comment.service';

@Controller('board')
export class BoardController {
  constructor(
    private boardService: BoardService,
    private commentService: CommentService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions('board')))
  async createBoard(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return await this.boardService.create(images, createBoardDto);
  }

  @Patch('/:id')
  @UseInterceptors(
    FilesInterceptor('images', 5, multerOptions('board')),
    BoardIntercepter,
  )
  async updateBoard(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.update(parseInt(id), images, updateBoardDto);
  }

  @Get('test/:id')
  @UseInterceptors(BoardIntercepter)
  test() {
    return 'hi';
  }

  @Delete('/:id')
  @UseInterceptors(BoardIntercepter)
  async deleteBoard(@Param('id') id: string) {
    return this.boardService.delete(parseInt(id));
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.boardService.findAll(query);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.boardService.findOne(parseInt(id));
  }

  @Post('/comment/:id')
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.create(parseInt(id), createCommentDto);
  }

  @Get('/comment/:id')
  async getComment(@Param('id') id: string) {
    return await this.commentService.find(parseInt(id));
  }
}
