import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  picUrl?: string;
  @IsBoolean()
  @IsOptional()
  isGroup?: boolean;
  @IsArray()
  members: number[];
}
