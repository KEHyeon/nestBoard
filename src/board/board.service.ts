import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Image } from './entities/image.entity';
import { JoinColumn, Repository } from 'typeorm';
import { CreateBoardDto } from './dtos/create-board.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateBoardDto } from './dtos/update-board.dto';
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(Image) private imageRepo: Repository<Image>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    const password = createBoardDto.password;
    const salt = await bcrypt.genSalt();
    createBoardDto.password = await bcrypt.hash(password, salt);
    const board = this.boardRepo.create(createBoardDto);
    return await this.boardRepo.save(board);
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    const board = await this.findOne(id);
    const { password, content } = updateBoardDto;
    if (!(await bcrypt.compare(password, board.password))) {
      throw new UnauthorizedException('incorrect password');
    }
    await this.boardRepo.update(id, { content });
    return await this.findOne(id);
  }
  async findOne(id: number) {
    const board = await this.boardRepo.findOneBy({ id });
    if (!board) {
      throw new NotFoundException('board not found');
    }
    return board;
  }

  async findAll() {
    return await this.boardRepo.find();
  }

  async uploadImg(id: number, images: Express.Multer.File[]) {
    const board = await this.boardRepo.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!board) {
      throw new NotFoundException('board not found');
    }
    if (board.images.length + images.length > 5) {
      throw new BadRequestException('max is 5');
    }

    const url = 'http://localhost:8000/board/';
    return await Promise.all(
      images.map(async (image) => {
        const createImg = this.imageRepo.create({
          board,
          path: url + image.filename,
        });
        console.log(createImg);
        return await this.imageRepo.save(createImg);
      }),
    );
  }

  async getImages(id: number) {
    const board = await this.boardRepo.findOne({
      where: { id },
      relations: ['images'],
    });
    return board.images;
  }

  async getOneImage(id: number) {
    const image = await this.imageRepo.findOneBy({ id });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }

  async deleteImage(id: number) {
    await this.imageRepo.delete({ id });
    return;
  }
}
