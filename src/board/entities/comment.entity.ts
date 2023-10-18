import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  password: string;

  @ManyToOne(() => Board, (board) => board.comments, {
    onDelete: 'CASCADE',
  })
  board: Board;
}
