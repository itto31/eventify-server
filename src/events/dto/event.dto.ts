import { IsNotEmpty, IsString, Length } from 'class-validator';

export class EventDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'El título debe tener entre 1 y 100 caracteres' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 500, {
    message: 'La descripción no puede tener más de 500 caracteres',
  })
  description: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  creatorId: number;

  @IsNotEmpty()
  categoryId: number;
}
