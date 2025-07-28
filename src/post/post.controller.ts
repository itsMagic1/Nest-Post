import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { Claims } from 'src/auth/decorators/claims.decorator';
import { Claim } from 'src/accesor-control/claims.enum';
import { userRole } from 'src/comment/comment.controller';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('bearerAuth')
@Controller('post')

export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService
  ) {}

  @Post()
  @Claims(Claim.CREATE_USER)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Missing required claim.' })
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const userId: string = req['user'].sub;
    return this.postService.create(createPostDto, userId);
  }
  
  @Get()
  @Claims(Claim.READ_USER)
  @ApiOperation({ summary: 'Retrieve all posts' })
  @ApiResponse({ status: 200, description: 'List of posts returned.' })
  @Claims(Claim.READ_USER)
  findAll() {
    return this.postService.findAll();
  }
  
  @Get(':id')
  @Claims(Claim.READ_USER)
  @ApiOperation({ summary: 'Retrieve a specific post by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Post found.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @Claims(Claim.UPDATE_PROFILE)
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Post updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized action.' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
    const {sub, role}: userRole = req['user'];
    console.log('desde controller', sub, role);
    return this.postService.update(id, updatePostDto, sub, role);
  }

  @Delete(':id')
  @Claims(Claim.DELETE_USER)
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Post deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Missing delete claim.' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const {sub, role}: userRole = req['user'];
    return this.postService.remove(id, sub, role);
  }
}
