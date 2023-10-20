import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from './image.entity';
import { Comment } from './comment.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  author: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  like: number;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: null })
  modifier: string;

  @OneToMany(() => Image, (image) => image.board, {
    cascade: true,
  })
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.board, {
    cascade: true,
  })
  comments: Comment[];
}
