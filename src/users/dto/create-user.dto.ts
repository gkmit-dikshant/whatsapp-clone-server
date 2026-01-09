import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
