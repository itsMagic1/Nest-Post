import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'Understanding JWT Authentication with NestJS',
  })
  @IsDefined()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Main body content of the post',
    example: 'In this guide, we’ll walk through setting up JWT in a NestJS application…',
  })
  @IsDefined()
  @IsString()
  content: string;
}