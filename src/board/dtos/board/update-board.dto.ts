import { IsString, IsOptional } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  password: string;
}
