import { IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  content: string;

  @IsString()
  password: string;

  @IsString()
  author: string;

  @IsString()
  title: string;
}
