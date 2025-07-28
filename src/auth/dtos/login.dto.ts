import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";

export class LoginDto {
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: 'Your unique username',
    example: 'Username123',
  })
  username: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    description: 'Your Password Account',
    example: 'password123'
  })
  password: string;
}