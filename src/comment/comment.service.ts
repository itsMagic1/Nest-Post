import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    try {
      const user = await this.userService.findUserById(userId);
      const post = await this.postService.findOne(createCommentDto.postId);
      const comment = this.commentRepository.create({ ...createCommentDto, user, post});
      await this.commentRepository.save(comment);

      const { user: username, ...rest} = comment;
      return rest;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating a Comment')
    }
  }

  async findAll() {
    return this.commentRepository.find();
  }

  findOne(id: string) {
    return this.commentRepository.findOne({ where: { id }, relations: ['post'] });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string, roles: string[]): Promise<UpdateResult> {
    if (!updateCommentDto || !Object.keys(updateCommentDto).length) {
      throw new BadRequestException('No updated fields provided');
    }
    try {
      await this.verifyOwnership(id, userId, roles);

      return this.commentRepository.update({ id }, updateCommentDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error Updating this comment');
    }
  }

  async remove(id: string, userId: string, roles: string[]): Promise<DeleteResult> {
    try {
      await this.verifyOwnership(id, userId, roles);

      return this.commentRepository.delete({ id });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error Updating this comment');
    }
  }

  async verifyOwnership(id: string, userId: string, roles: string[]): Promise<void> {
    const comment = await this.findOne(id);

    const isOwner = comment?.user.id === userId;
    const hasprivilege = roles.includes('admin');
    if (!isOwner && !hasprivilege) {
      throw new ForbiddenException('You do not have access to this resource');
    }
  }
}
