import { Inject, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePostDto, PostEntity, QueryPostDto, UpdatePostDto } from '../database/entities';
import { Like, Repository } from 'typeorm';

@Injectable()
export class PostService {
    constructor(
        @Inject(getRepositoryToken(PostEntity)) private readonly postRepo: Repository<PostEntity>
    ) {}

    async createPost(postData: CreatePostDto): Promise<PostEntity> {
        const newPost = this.postRepo.create(postData);
        return await this.postRepo.save(newPost);
    }

    async findPostById(id: string): Promise<PostEntity | null> {
        return await this.postRepo.findOne({ where: { id } });
    }

    async updatePost(id: string, postData: UpdatePostDto): Promise<PostEntity | null> {
        await this.postRepo.update(id, postData);
        return this.findPostById(id);
    }

    async deletePost(id: string): Promise<boolean> {
        const result = await this.postRepo.delete(id);
        if (!result.affected) {
            throw new Error('Delete operation did not return affected rows');
        }
        return result.affected > 0;
    }


    async findPosts(query: QueryPostDto): Promise<PostEntity[]> {
        const { content, userProfileId } = query;
        const where: any = {};
        if (userProfileId) {
            where.userProfile = { id: userProfileId };
        }
        if (content) {
            where.content = Like(`%${content}%`);
        }
        return await this.postRepo.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }

}
