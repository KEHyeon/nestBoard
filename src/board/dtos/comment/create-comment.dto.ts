import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  author: string;

  @IsString()
  password: string;

  @IsString()
  description: string;
}
