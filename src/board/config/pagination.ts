import { PaginateConfig } from 'nestjs-paginate';
import { Board } from '../entities/board.entity';

export const paginateConfig: PaginateConfig<Board> = {
  sortableColumns: ['id', 'created_at'],
  defaultSortBy: [['created_at', 'ASC']],
  searchableColumns: ['title', 'content'],
  select: [
    'id',
    'title',
    'content',
    'author',
    'modifier',
    'created_at',
    'updated_at',
    'like',
    'views',
  ],
};
