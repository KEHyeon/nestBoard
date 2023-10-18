import { IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  author: string;

  @IsString()
  password: string;

  @IsString()
  description: string;
}
