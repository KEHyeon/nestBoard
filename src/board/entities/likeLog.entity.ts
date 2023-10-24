import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class LikeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userIP: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Board)
  @JoinColumn({ name: 'postId' })
  board: Board;

  @Column()
  boardId: number;
}
