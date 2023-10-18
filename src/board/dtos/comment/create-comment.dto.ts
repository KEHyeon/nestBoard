import { IsString } from 'class-validator';

export class CreateCommentdDto {
  @IsString()
  author: string;

  @IsString()
  password: string;

  @IsString()
  description: string;
}
