import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from './image.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: null })
  modifier: string;

  @OneToMany(() => Image, (image) => image.id)
  Images: Image[];
}
