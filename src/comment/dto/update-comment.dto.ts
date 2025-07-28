import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'The text content of the comment',
    example: 'This article really helped me understand NestJS!',
  })
  @IsDefined()
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Identifier of the post this comment belongs to',
  })
  @IsDefined()
  @IsString()
  postId: string;
}