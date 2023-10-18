import { Entity } from 'typeorm';

@Entity()
export class Comment {
  author: string;

  description: string;

  created_at: Date;

  password: string;
}
