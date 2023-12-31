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
import { CreateBoardDto } from './dtos/board/create-board.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateBoardDto } from './dtos/board/update-board.dto';
import * as fs from 'fs';
import * as path from 'path';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { paginateConfig } from './config/pagination';
import { ViewLog } from './entities/viewLog.entity';
import { ThrottlerException } from '@nestjs/throttler';
import { LikeLog } from './entities/likeLog.entity';
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepo: Repository<Board>,
    @InjectRepository(Image) private imageRepo: Repository<Image>,
    @InjectRepository(ViewLog) private viewLogRepo: Repository<ViewLog>,
    @InjectRepository(LikeLog) private likeLogRepo: Repository<ViewLog>,
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

    if (updateBoardDto.images != undefined || images?.length) {
      delete updateBoardDto.images;
      await Promise.all(
        board.images.map((image) => {
          const fileName = path.basename(image.path);
          fs.unlink(`static/board/${fileName}`, (err) => {
            if (err) throw err;
          });
          return this.imageRepo.delete(image.id);
        }),
      );
    }

    updateBoardDto.password = board.password;
    const url = 'http://localhost:8000/board/';
    await Promise.all([
      ...images.map((image) => {
        const createImg = this.imageRepo.create({
          board,
          path: url + image.filename,
        });
        return this.imageRepo.save(createImg);
      }),
      this.boardRepo.update(id, updateBoardDto),
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

  async findAll(query: PaginateQuery) {
    const boards = await paginate(query, this.boardRepo, paginateConfig);
    const data = await Promise.all(
      boards.data.map(async (board) => {
        const thumbnail = await this.imageRepo.findOne({
          where: { board: { id: board.id } },
          order: {
            id: 'ASC',
          },
        });
        return { ...board, thumbnail };
      }),
    );
    boards.data = data;
    return boards;
  }

  async likePost(boardId: number, userIP) {
    const board = await this.findOne(boardId);
    const likeLog = await this.likeLogRepo.findOne({
      where: {
        boardId,
        userIP,
      },
    });
    if (likeLog) {
      throw new ThrottlerException('Too many request');
    }
    board.like += 1;
    const newViewLog = this.likeLogRepo.create({
      boardId,
      userIP,
    });
    await this.likeLogRepo.save(newViewLog);
    await this.boardRepo.save(board);
    return 'ok';
  }

  async isLikedPost(boardId: number, userIP) {
    const board = await this.findOne(boardId);
    const likeLog = await this.likeLogRepo.findOne({
      where: {
        boardId,
        userIP,
      },
    });
    return likeLog ? true : false;
  }
  async increaseViewsOncePerHour(boardId: number, userIP: string) {
    const board = await this.findOne(boardId);
    const lastViewLog = await this.viewLogRepo.findOne({
      where: {
        boardId,
        userIP,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (lastViewLog && !this.isMoreThanOneHourAgo(lastViewLog.createdAt)) {
      throw new ThrottlerException('Too many request');
    }
    board.views += 1;
    const newViewLog = this.viewLogRepo.create({
      boardId,
      userIP,
    });
    await this.viewLogRepo.save(newViewLog);
    await this.boardRepo.save(board);
    return 'ok';
  }

  private isMoreThanOneHourAgo(createdAt: Date): boolean {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - createdAt.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return diffInHours >= 1;
  }
}
