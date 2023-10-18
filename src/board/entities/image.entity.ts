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

  @ManyToOne(() => Board, (board) => board.images, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @CreateDateColumn()
  created_at: Date;
}
