import { IsDataURI, IsDate, IsDateString, IsNotEmpty, IsNumber, IsString, isDate } from "class-validator"

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
