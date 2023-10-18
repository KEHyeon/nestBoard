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
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(Image) private imageRepo: Repository<Image>,
  ) {}

  async create(images: Express.Multer.File[], createBoardDto: CreateBoardDto) {
    const password = createBoardDto.password;
    const salt = await bcrypt.genSalt();
    createBoardDto.password = await bcrypt.hash(password, salt);
    const board = this.boardRepo.create(createBoardDto);
    await this.boardRepo.save(board);
    const url = 'http://localhost:8000/board/';
    await Promise.all(
      images.map((image) => {
        const createImg = this.imageRepo.create({
          board,
          path: url + image.filename,
        });
        return this.imageRepo.save(createImg);
      }),
    );
    return await this.boardRepo.findOne({
      where: { id: board.id },
      relations: ['images'],
    });
  }

  async update(
    id: number,
    images: Express.Multer.File[],
    updateBoardDto: UpdateBoardDto,
  ) {
    const board = await this.boardRepo.findOne({
      where: { id },
      relations: ['images'],
    });

    await Promise.all(
      board.images.map((image) => {
        const fileName = path.basename(image.path);
        fs.unlink(`static/board/${fileName}`, (err) => {
          if (err) throw err;
        });
        this.imageRepo.delete(image.id);
        return;
      }),
    );

    const { content, title } = updateBoardDto;
    const url = 'http://localhost:8000/board/';
    await Promise.all([
      images?.map((image) => {
        const createImg = this.imageRepo.create({
          board,
          path: url + image.filename,
        });
        return this.imageRepo.save(createImg);
      }),
      this.boardRepo.update(id, { content, title }),
    ]);
    return await this.findOne(id);
  }

  async delete(id: number) {
    await this.boardRepo.delete(id);
    return;
  }

  async findOne(id: number) {
    const board = await this.boardRepo.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!board) {
      throw new NotFoundException('board not found');
    }
    return board;
  }

  async findAll() {
    return await this.boardRepo.find();
  }
}
