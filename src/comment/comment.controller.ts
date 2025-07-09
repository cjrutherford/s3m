import { CommentService } from './comment.service';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../authentication/auth/auth.guard';
import User, { UserType } from 'src/authentication/user.decorator';
import { CreateCommentDto, UpdateCommentDto } from 'src/database/entities';
import { PostService } from 'src/post/post.service';

@UseGuards(AuthGuard)
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly usersService: UsersService,
    private readonly postService: PostService,
  ) {}

  @Get('/post/:postId')
  async getCommentsByPostId(@Param('postId') postId: string) {
    return this.commentService.findCommentsByPostId(postId);
  }

  @Post()
  async addComment(
    @User() user: UserType,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userProfile = await this.usersService.getUserProfile(
        user.userId,
    )
    if (!userProfile) {
      throw new Error(`User profile not found for user ID: ${user.userId}`);
    }
    if (userProfile.user.id !== user.userId) {
      throw new Error('You can only create comments for your own profile');
    }
    const post = await this.postService.findPostById(createCommentDto.postId);
    if (!post) {
      throw new Error(`Post not found for ID: ${createCommentDto.postId}`);
    }
    return this.commentService.createComment(createCommentDto);
  }

  @Put(':id')
  async updateComment(
    @User() user: UserType,
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userProfile = await this.usersService.getUserProfile(
        user.userId,
    )
    if (!userProfile) {
      throw new Error(`User profile not found for user ID: ${user.userId}`);
    }
    if (userProfile.user.id !== user.userId) {
      throw new Error('You can only update comments for your own profile');
    }
    return this.commentService.updateComment(commentId, updateCommentDto);
  }

  @Delete(':id')
  async deleteComment(@User() user: UserType, @Param('id') commentId: string) {
    const comment = await this.commentService.findCommentsById(commentId);
    if (!comment) {
      throw new Error(`Comment not found with ID: ${commentId}`);
    }
    const userProfile = await this.usersService.getUserProfile(
        comment.userProfile.id,
    )
    if (!userProfile) {
      throw new Error(`User profile not found for user ID: ${comment.userProfile.id}`);
    }
    if (userProfile.user.id !== user.userId) {
      throw new Error('You can only delete comments for your own profile');
    }
    return this.commentService.deleteComment(commentId);
  }
}
