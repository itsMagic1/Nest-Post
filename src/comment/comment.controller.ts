import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('comment')
@ApiBearerAuth('bearerAuth')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiBody({ type: CreateCommentDto })
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    const userId: string = req['user'];
    return this.commentService.create(createCommentDto, userId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Fetch all comments' })
  @ApiResponse({ status: 200, description: 'Returns list of comments' })
  findAll() {
    return this.commentService.findAll();
  }

  @Public() 
  @Get(':id')
  @ApiOperation({ summary: 'Fetch a comment by ID' })
  @ApiResponse({ status: 200, description: 'Returns the comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiParam({ name: 'id', type: String, example: 'abc123' })
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiParam({ name: 'id', type: String, example: 'abc123' })
  @ApiBody({ type: UpdateCommentDto })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req: Request) {
    const {sub, role}: userRole = req['user'];
    return this.commentService.update(id, updateCommentDto, sub, role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiParam({ name: 'id', type: String, example: 'abc123' })
  remove(@Param('id') id: string, @Req() req: Request) { 
    const {sub, role}: userRole = req['user'];
    return this.commentService.remove(id, sub, role);
  }
}


export type userRole = { sub: string, role: string[]};