import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({ where: { id: Number(id) } });
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  async update(id: number, updateCategoryDto: CreateCategoryDto) {
    return this.prisma.category.update({
      where: { id: Number(id) },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    await this.prisma.category.delete({ where: { id: Number(id) } });
    return 'Categoria eliminada';
  }
}
