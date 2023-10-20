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
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Expose()
  @Column()
  @ApiProperty()
  path: string;

  @ManyToOne(() => Board, (board) => board.images, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @Expose()
  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;
}
