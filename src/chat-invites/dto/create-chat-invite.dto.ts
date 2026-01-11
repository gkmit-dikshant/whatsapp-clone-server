import { IsEmail, IsNumber, IsOptional } from 'class-validator';

export class CreateChatInviteDto {
  @IsEmail()
  sendTo: string;
  @IsNumber()
  @IsOptional()
  expiry?: number;
}
