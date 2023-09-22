import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EventEditDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  date: Date;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  categoryId: number;
}
