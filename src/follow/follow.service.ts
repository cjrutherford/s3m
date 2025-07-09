import { Inject, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateFollowDto, FollowEntity, DeleteFollowDto } from '../database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
    constructor(
        @Inject(getRepositoryToken(FollowEntity)) private readonly followRepo: Repository<FollowEntity>
    ) {}

    async followUser(follow: CreateFollowDto) {
        const existingFollow = await this.followRepo.findOne({
            where: {
                follower: { id: follow.followerId },
                following: { id: follow.followingId }
            }
        });
        
        if (existingFollow) {
            // If the follow relationship already exists, return it
            return existingFollow;
        }

        // If the follow relationship doesn't exist, create a new one
        const newFollow = this.followRepo.create({
            follower: { id: follow.followerId },
            following: { id: follow.followingId }
        });
        return await this.followRepo.save(newFollow);
    }

    async unfollowUser(follow: DeleteFollowDto) {
        const existingFollow = await this.followRepo.findOne({
            where: {
                follower: { id: follow.followerId },
                following: { id: follow.followingId }
            }
        });

        if (existingFollow) {
            // If the follow relationship exists, remove it
            await this.followRepo.remove(existingFollow);
            return existingFollow;
        }

        // If the follow relationship doesn't exist, return null
        return null;
    }

    async getFollowers(userId: string) {
        return await this.followRepo.find({
            where: { following: { id: userId } },
            relations: ['follower']
        });
    }

    async getFollowing(userId: string) {
        return await this.followRepo.find({
            where: { follower: { id: userId } },
            relations: ['following']
        });
    }
}
