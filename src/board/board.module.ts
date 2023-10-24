import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Image } from './entities/image.entity';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { ViewLog } from './entities/viewLog.entity';
import { LikeLog } from './entities/likeLog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Image, Comment, ViewLog, LikeLog]),
  ],
  controllers: [BoardController],
  providers: [BoardService, CommentService],
})
export class BoardModule {}
