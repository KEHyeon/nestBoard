import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { BoardService } from '../board.service';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class BoardIntercepter implements NestInterceptor {
  constructor(private boardService: BoardService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const password = request.body.password;
    if (!password) {
      throw new BadRequestException('password를 주세요');
    }
    const board = await this.boardService.findOne(id);
    if (!(await bcrypt.compare(password, board.password))) {
      throw new UnauthorizedException('incorrect password');
    }
    return next.handle().pipe(tap(() => {}));
  }
}
