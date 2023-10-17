import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
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

  async uploadImg(id: number, files: Express.Multer.File[]) {
    const fileName = `${files[0].filename}`;
    console.log(fileName);
    const newImg = await this.imageRepo;
  }
}
