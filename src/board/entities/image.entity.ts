import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Board, (board) => board.Images)
  @Column()
  board: Board;

  @CreateDateColumn()
  created_at: Date;
}
