import { Inject, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePostDto, PostEntity, QueryPostDto, UpdatePostDto, UserProfileEntity } from '../database/entities';
import { Like, Repository } from 'typeorm';

@Injectable()
export class PostService {
    constructor(
        @Inject(getRepositoryToken(PostEntity)) private readonly postRepo: Repository<PostEntity>,
        @Inject(getRepositoryToken(UserProfileEntity)) private readonly userProfileRepo: Repository<UserProfileEntity>,
    ) {}

    async createPost(postData: CreatePostDto): Promise<PostEntity> {
        const newPost = this.postRepo.create(postData);
        const userProfile = await this.userProfileRepo.findOne({
            where: { id: postData.userProfileId },
            relations: ['user'],
        });
        if (!userProfile) {
            throw new Error(`User profile not found for ID: ${postData.userProfileId}`);
        }
        newPost.userProfile = userProfile;
        const savedPost = await this.postRepo.save(newPost);
        const final = await this.postRepo.findOne({ where: { id: savedPost.id }, relations: ['userProfile'] });
        if (!final) {
            throw new Error('Post not found after creation');
        }
        return final;
    }

    async findPostById(id: string): Promise<PostEntity | null> {
        const foundPost = await this.postRepo.findOne({ where: { id }, relations: ['userProfile'] });
        return foundPost;
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
        const foundPosts =  await this.postRepo.find({
            where,
            order: { createdAt: 'DESC' },
            relations: ['userProfile', 'comments'],
        });
        return foundPosts;
    }

}
