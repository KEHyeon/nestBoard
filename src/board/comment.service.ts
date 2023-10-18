import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateCommentDto } from './dtos/comment/create-comment.dto';
import { BoardService } from './board.service';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    private boardService: BoardService,
  ) {}
  async findOne(id: number) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException('comment not found');
    }
    return comment;
  }
  async create(boardId: number, createCommentDto: CreateCommentDto) {
    const board = await this.boardService.findOne(boardId);
    const comment = await this.commentRepo.create({
      ...createCommentDto,
      board: board,
    });
    await this.commentRepo.save(comment);
    return await this.findOne(comment.id);
  }

  async find(boardId: number) {
    const board = await this.boardRepo.findOne({
      where: { id: boardId },
      relations: ['comments'],
    });
    return board.comments;
  }
}
