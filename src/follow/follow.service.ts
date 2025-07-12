import { Inject, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateFollowDto, FollowEntity, DeleteFollowDto, UserProfileEntity } from '../database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
    constructor(
        @Inject(getRepositoryToken(FollowEntity)) private readonly followRepo: Repository<FollowEntity>,
        @Inject(getRepositoryToken(UserProfileEntity)) private readonly userProfileRepo: Repository<UserProfileEntity>
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
        const followerProfile = await this.userProfileRepo.findOne({
            where: { id: follow.followerId },
            relations: ['user']
        });
        const followingProfile = await this.userProfileRepo.findOne({
            where: { id: follow.followingId },
            relations: ['user']
        });
        if (!followerProfile || !followingProfile) {
            throw new Error(`Follower or following profile not found... Following: ${!!followingProfile}, Follower: ${!!followerProfile}`);
        }
        const newFollow = this.followRepo.create({
            follower: followerProfile,
            following: followingProfile
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
            await this.followRepo.delete(existingFollow.id);
            return existingFollow;
        }

        // If the follow relationship doesn't exist, return null
        return null;
    }

    async getFollowers(userId: string) {
        const followers = await this.followRepo.find({
            where: { following: { id: userId } },
            relations: ['follower']
        });
        return followers;
    }

    async getFollowing(userId: string): Promise<FollowEntity[]> {
        return await this.followRepo.find({
            where: { follower: { id: userId } },
            relations: ['following']
        });
    }
}
