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
  ApiOperation,
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
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { paginateConfig } from './config/pagination';

@ApiTags('board')
@Controller('board')
@SkipThrottle()
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
  @ApiOperation({
    summary: '게시글 생성',
    description: '게시글 생성 api',
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
  @ApiOperation({
    summary: '게시글 수정',
    description: '게시글 수정 api',
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
  @ApiOperation({
    summary: '게시글 삭제',
    description: '게시글 삭제 api',
  })
  async deleteBoard(@Param('id') id: string) {
    return this.boardService.delete(parseInt(id));
  }

  @Get()
  @ApiCreatedResponse({
    isArray: true,
    type: ResBoardDto,
  })
  @ApiPaginationQuery(paginateConfig)
  @ApiOperation({
    summary: '게시글 리스트 받아오기',
    description: '게시글 리스트 받아오기 api',
  })
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.boardService.findAll(query);
  }

  @SkipThrottle({ default: false })
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('/like/:id')
  @ApiOperation({
    summary: '게시글 좋아요',
    description: '게시글 좋아요 api',
  })
  likePost(@Param('id') id: number) {
    return this.boardService.likePost(id);
  }

  @SkipThrottle({ default: false })
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('/view/:id')
  @ApiOperation({
    summary: '게시글 조회수 증가',
    description: '게시글 조회수 증가 api',
  })
  viewPost(@Param('id') id: number) {
    return this.boardService.viewPost(id);
  }

  @ApiCreatedResponse({
    type: ResCreateBoardDto,
  })
  @Get('/:id')
  @ApiOperation({
    summary: '게시글 detail 받아오기',
    description: '게시글 detail 받아오기 api',
  })
  async findOne(@Param('id') id: string) {
    return await this.boardService.findOne(parseInt(id));
  }
  @Post('/comment/:id')
  @ApiCreatedResponse({
    type: ResCommentDto,
  })
  @Serialize(ResCommentDto)
  @ApiParam({ name: 'id', description: '댓글 아이디' })
  @ApiOperation({
    summary: '게시글 댓글 달기',
    description: '게시글 댓글 달기 api',
  })
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
  @ApiOperation({
    summary: '게시글 댓글들 받아오기',
    description: '게시글 댓글들 받아오기 api',
  })
  @Serialize(ResCommentDto)
  async getComment(@Param('id') id: string) {
    return await this.commentService.find(parseInt(id));
  }

  @Delete('/comment/:id')
  @ApiParam({ name: 'id', description: '댓글 아이디' })
  @ApiOperation({
    summary: '댓글 삭제',
    description: '댓글 삭제 api',
  })
  async deleteComment(
    @Param('id') id: string,
    @Body() { password }: DeleteCommentDto,
  ) {
    return await this.commentService.delete(parseInt(id), password);
  }
}
