import { IsString, IsNotEmpty } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
