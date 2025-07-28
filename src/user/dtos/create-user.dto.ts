import { IsArray, IsDefined, IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "../../accesor-control/roles.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: 'Your unique username',
    example: 'Username123'
  })
  username: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    description: 'Your password Acount',
    example: 'Password123'
  })
  password: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  @ApiProperty({
    description: "User Roles, (if not provided, the default user will be assigned)",
    example: '["user", "admin"]',
  })
  role?: string[];
}