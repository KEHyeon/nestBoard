import { IsString, IsOptional } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  content: string;

  @IsString()
  password: string;
}
