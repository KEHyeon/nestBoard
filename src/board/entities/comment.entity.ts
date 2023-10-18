import { Entity, ManyToOne } from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class Comment {
  author: string;

  description: string;

  created_at: Date;

  password: string;

  @ManyToOne(() => Board, (board) => board.comments, {
    onDelete: 'CASCADE',
  })
  board: Board;
}
