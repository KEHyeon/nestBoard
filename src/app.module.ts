import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board/entities/board.entity';
import { Image } from './board/entities/image.entity';
import { Comment } from './board/entities/comment.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ViewLog } from './board/entities/viewLog.entity';
import { LikeLog } from './board/entities/likeLog.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get<string>('MYSQL_HOST', 'mysql'),
          port: config.get<number>('MYSQL_PORT', 3306),
          username: config.get<string>('MYSQL_USERNAME', 'root'),
          password: config.get<string>('MYSQL_PASSWORD', '1234'),
          database: config.get<string>('MYSQL_DB_NAME', 'board'),
          entities: [Board, Comment, Image, ViewLog, LikeLog],
          synchronize: true,
        };
      },
    }),
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
