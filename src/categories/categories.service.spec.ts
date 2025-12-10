import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

interface CategoryPaginationOptions extends IPaginationOptions {
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(options: CategoryPaginationOptions): Promise<Pagination<Category>> {
    const { search, searchField, sortBy, sortOrder } = options;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    // Campos permitidos para búsqueda y ordenamiento (evitar SQL injection)
    const allowedSearchFields = ['name', 'slug', 'description'];
    const allowedSortFields = ['id', 'name', 'createdAt'];

    if (search && searchField && allowedSearchFields.includes(searchField)) {
      queryBuilder.andWhere(
        `LOWER(category.${searchField}) LIKE :search`,
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const orderField = sortBy && allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const orderDirection: 'ASC' | 'DESC' =
      sortOrder === 'DESC' ? 'DESC' : 'ASC';

    queryBuilder.orderBy(`category.${orderField}`, orderDirection);

    return paginate<Category>(queryBuilder, {
      page: options.page,
      limit: options.limit,
    });
  }
}
