import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService
  ) {}
  
  async create(createPostDto: CreatePostDto, userId: string) {
    const user = await this.userService.findUserById(userId);

    try {
      const post = this.postRepository.create({ ...createPostDto, user});
      await this.postRepository.save(post);

      const { user: username, ...rest} = post;
      return rest;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating the Post');
    }
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({where: { id }, relations: ['comments']});
    if (!post) {
      throw new NotFoundException('Post not Found');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string, roles: string[]): Promise<UpdateResult> {
    if (!UpdatePostDto || !Object.keys(updatePostDto).length) {
      throw new BadRequestException('No updated fields provided');
    }
    await this.ensureOwnership(id, userId, roles);
    return this.postRepository.update({ id }, updatePostDto);
  }

  async remove(id: string, userId: string, role: string[]): Promise<DeleteResult> {
    await this.ensureOwnership(id, userId, role);
    return this.postRepository.delete({ id });
  }

  private async ensureOwnership(id: string, userId: string, roles: string[]): Promise<void> {
    const post = await this.findOne(id);

    const isOwner = post.user.id === userId;
    const hasprivilege = roles.includes('admin');

    if (!isOwner && !hasprivilege) {
      throw new ForbiddenException('You do not have access to this resource');
    }
  }
}
