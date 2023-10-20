import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Image } from 'src/board/entities/image.entity';
export class ResBoardDto {
  @ApiProperty()
  @Expose()
  id: number;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  content: string;

  @Expose()
  @ApiProperty()
  like: number;

  @Expose()
  @ApiProperty()
  viwes: number;

  @Expose()
  @ApiProperty()
  author: string;

  @Expose()
  @ApiProperty()
  created_at: Date;

  @Expose()
  @ApiProperty()
  updated_at: Date;

  @Expose()
  @ApiProperty()
  modifier: string;
}
