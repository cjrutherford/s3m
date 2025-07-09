import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentEntity, CreateCommentDto, UpdateCommentDto } from '../database/entities';

import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
    constructor(
      @Inject(getRepositoryToken(CommentEntity)) private readonly commentRepo: Repository<CommentEntity>,
    ) {}

    async createComment(commentData: CreateCommentDto): Promise<CommentEntity> {
        const newComment = this.commentRepo.create(commentData);
        return await this.commentRepo.save(newComment);
    }

    async findCommentsByPostId(postId: string): Promise<CommentEntity[]> {
        return await this.commentRepo.find({ where: { post: { id: postId } } });
    }

    async updateComment(id: string, commentData: UpdateCommentDto): Promise<CommentEntity | null> {
        await this.commentRepo.update(id, commentData);
        return this.commentRepo.findOne({ where: { id } });
    }

    async deleteComment(id: string): Promise<boolean> {
        const result = await this.commentRepo.delete(id);
        if (!result.affected) {
            throw new Error('Delete operation did not return affected rows');
        }
        return result.affected > 0;
    }

    async findCommentsById(id: string): Promise<CommentEntity | null> {
        return await this.commentRepo.findOne({ where: { id } });
    }

}
