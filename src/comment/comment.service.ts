import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentEntity, CreateCommentDto, PostEntity, UpdateCommentDto, UserProfileEntity } from '../database/entities';

import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
    constructor(
      @Inject(getRepositoryToken(CommentEntity)) private readonly commentRepo: Repository<CommentEntity>,
      @Inject(getRepositoryToken(UserProfileEntity)) private readonly userProfileRepo: Repository<UserProfileEntity>,
      @Inject(getRepositoryToken(PostEntity)) private readonly postRepo: Repository<PostEntity>,
    ) {}

    async createComment(commentData: CreateCommentDto): Promise<CommentEntity> {
        const newComment = this.commentRepo.create(commentData);
        const userProfile = await this.userProfileRepo.findOne({
            where: { id: commentData.userProfileId },
            relations: ['user'],
        });
        if( !userProfile) {
            throw new Error(`User profile not found for ID: ${commentData.userProfileId}`);
        }
        newComment.userProfile = userProfile;
        const post = await this.postRepo.findOne({
            where: { id: commentData.postId },
            relations: ['userProfile'],
        });
        if (!post) {
            throw new Error(`Post not found for ID: ${commentData.postId}`);
        }
        newComment.post = post;
        return await this.commentRepo.save(newComment);
    }

    async findCommentsByPostId(postId: string): Promise<CommentEntity[]> {
        return await this.commentRepo.find({
            where: { post: { id: postId } },
            relations: ['userProfile'],
            order: { createdAt: 'DESC' },
        });
    }

    async updateComment(id: string, commentData: UpdateCommentDto): Promise<CommentEntity | null> {
        await this.commentRepo.update(id, commentData);
        return this.commentRepo.findOne({ where: { id }, relations: ['userProfile'] });
    }

    async deleteComment(id: string): Promise<boolean> {
        const result = await this.commentRepo.delete(id);
        if (!result.affected) {
            throw new Error('Delete operation did not return affected rows');
        }
        return result.affected > 0;
    }

    async findCommentsById(id: string): Promise<CommentEntity | null> {
        return await this.commentRepo.findOne({ where: { id }, relations: ['userProfile'] });
    }

}
