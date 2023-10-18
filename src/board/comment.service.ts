import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Board) private boardRepo: Repository<Comment>,
  ) {}
}
