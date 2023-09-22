import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class EventDetailDto {
  @IsNotEmpty()
  @IsNumber()
  eventId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsString()
  location: string;

  creator: {
    name: string; // Agrega aquí otras propiedades del usuario si es necesario
  };
}
