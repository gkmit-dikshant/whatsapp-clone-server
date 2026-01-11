import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;
  @IsArray()
  @IsOptional()
  media?: string[];
}
