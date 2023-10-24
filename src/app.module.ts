import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board/entities/board.entity';
import { Image } from './board/entities/image.entity';
import { Comment } from './board/entities/comment.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 1, limit: 1 }]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get<string>('MYSQL_HOST', 'mysql'),
          port: config.get<number>('MYSQL_PORT', 3306),
          username: config.get<string>('MYSQL_USERNAME', 'root'),
          password: config.get<string>('MYSQL_PASSWORD', '1234'),
          database: config.get<string>('MYSQL_DB_NAME', 'board'),
          entities: [Board, Comment, Image],
          synchronize: true,
        };
      },
    }),
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
