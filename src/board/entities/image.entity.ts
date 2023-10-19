import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  @ApiProperty()
  path: string;

  @ManyToOne(() => Board, (board) => board.images, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @CreateDateColumn()
  created_at: Date;
}
