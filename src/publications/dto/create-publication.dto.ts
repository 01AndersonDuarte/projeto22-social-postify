import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePublicationDto {
  @IsNumber()
  @IsNotEmpty()
  mediaId: number;

  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
