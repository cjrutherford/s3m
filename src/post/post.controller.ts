import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../authentication/auth/auth.guard';
import { CreatePostDto, QueryPostDto } from '../database/entities';
import User, { UserType } from '../authentication/user.decorator';


@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly usersService: UsersService
    ) {}

    
    @Post('')
    async createPost(@User() user: UserType, @Body() createPostDto: CreatePostDto) {
        const userProfile = await this.usersService.getUserProfileById(createPostDto.userProfileId);
        if (!userProfile) {
            throw new Error(`User profile not found for user ID: ${createPostDto.userProfileId}`);
        }
        if (userProfile.user.id !== user.userId) {
            throw new Error('You can only create posts for your own profile');
        }
        return await this.postService.createPost(createPostDto);
    }

    @Put(':id')
    async updatePost(@User() user: UserType, @Param('id') postId: string, @Body() updatePostDto: CreatePostDto) {
        const userProfile = await this.usersService.getUserProfile(updatePostDto.userProfileId);
        if (!userProfile) {
            throw new Error(`User profile not found for user ID: ${updatePostDto.userProfileId}`);
        }
        if (userProfile.user.id !== user.userId) {
            throw new Error('You can only update posts for your own profile');
        }
        return await this.postService.updatePost(postId, updatePostDto);
    }

    @Delete(':id')
    async deletePost(@User() user: UserType, @Param('id') postId: string) {
        const post = await this.postService.findPostById(postId);
        if (!post) {
            throw new Error(`Post not found with ID: ${postId}`);
        }
        const userProfile = await this.usersService.getUserProfile(post.userProfile.id);
        if (!userProfile) {
            throw new Error(`User profile not found for user ID: ${post.userProfile.id}`);
        }
        if (userProfile.user.id !== user.userId) {
            throw new Error('You can only delete posts for your own profile');
        }
        return await this.postService.deletePost(postId);
    }

    @Post('find')
    async findPosts(@Body() query: QueryPostDto) {
        return await this.postService.findPosts(query);
    }
}
