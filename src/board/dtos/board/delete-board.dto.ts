import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteBoardDto {
  @ApiProperty()
  @IsString()
  password: string;
}
