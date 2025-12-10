import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    create(createCategoryDto: CreateCategoryDto) {
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }

    async findAll(options: IPaginationOptions): Promise<Pagination<Category>> {
        const queryBuilder = this.categoryRepository.createQueryBuilder('category');
        return paginate<Category>(queryBuilder, options);
    }


    findOne(id: string) {
        return this.categoryRepository.findOne({ where: { id } });
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) return null;
        Object.assign(category, updateCategoryDto);
        return this.categoryRepository.save(category);
    }

    async remove(id: string) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) return null;
        return this.categoryRepository.remove(category);
    }
}
