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
import { DeleteCommentDto } from './dtos/comment/delete-comment.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ResCreateBoardDto } from './dtos/board/response/res-create-board.dto';
import { Serialize } from './intercepters/serailize.interceptor';
import { ResBoardDto } from './dtos/board/response/res-board.dto';
import { ApiOkPaginatedResponse, ApiPaginationQuery } from 'nestjs-paginate';
import { ResCommentDto } from './dtos/comment/response/res-comment.dto';
import { type } from 'os';
import { DeleteBoardDto } from './dtos/board/delete-board.dto';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(
    private boardService: BoardService,
    private commentService: CommentService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions('board')))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    type: ResCreateBoardDto,
  })
  @Serialize(ResCreateBoardDto)
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
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    type: ResCreateBoardDto,
  })
  @Serialize(ResCreateBoardDto)
  async updateBoard(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.update(parseInt(id), images, updateBoardDto);
  }

  @Delete('/:id')
  @UseInterceptors(BoardIntercepter)
  @ApiBody({ type: DeleteBoardDto })
  async deleteBoard(@Param('id') id: string) {
    return this.boardService.delete(parseInt(id));
  }

  @Get()
  @ApiCreatedResponse({
    isArray: true,
    type: ResBoardDto,
  })
  @ApiPaginationQuery({
    sortableColumns: ['id', 'created_at'],
    defaultSortBy: [['created_at', 'ASC']],
    searchableColumns: ['title', 'content'],
    select: [
      'id',
      'title',
      'content',
      'author',
      'modifier',
      'created_at',
      'updated_at',
    ],
  })
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.boardService.findAll(query);
  }

  @ApiCreatedResponse({
    type: ResCreateBoardDto,
  })
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.boardService.findOne(parseInt(id));
  }

  @Post('/comment/:id')
  @ApiCreatedResponse({
    type: ResCommentDto,
  })
  @Serialize(ResCommentDto)
  @ApiParam({ name: 'id', description: '댓글 아이디' })
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.create(parseInt(id), createCommentDto);
  }

  @Get('/comment/:id')
  @ApiCreatedResponse({
    isArray: true,
    type: ResCommentDto,
  })
  @ApiParam({ name: 'id', description: '게시글 아이디' })
  @Serialize(ResCommentDto)
  async getComment(@Param('id') id: string) {
    return await this.commentService.find(parseInt(id));
  }

  @Delete('/comment/:id')
  @ApiParam({ name: 'id', description: '댓글 아이디' })
  async deleteComment(
    @Param('id') id: string,
    @Body() { password }: DeleteCommentDto,
  ) {
    return await this.commentService.delete(parseInt(id), password);
  }
}
