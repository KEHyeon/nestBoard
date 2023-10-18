import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateCommentdDto } from './dtos/comment/create-comment.dto';
import { BoardService } from './board.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Board) private boardRepo: Repository<Comment>,
    private boardService: BoardService,
  ) {}

  async create(boardId: number, createCommentDto: CreateCommentdDto) {
    const board = await this.boardService.findOne(boardId);
    const comment = await this.commentRepo.create({
      ...createCommentDto,
      board,
    });
    return await this.commentRepo.save(comment);
  }
}
