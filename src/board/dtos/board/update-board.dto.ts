import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  content: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  title: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  images: any[];

  @IsString()
  @ApiProperty()
  modifier: string;
}
