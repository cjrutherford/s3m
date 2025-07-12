import { getRepositoryToken } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import VoteEntity, { CreateUpdateVoteDto } from '../database/entities/vote.entity';
import { Repository } from 'typeorm';
import { PostEntity, UserProfileEntity } from 'src/database/entities';

@Injectable()
export class VoteService {

    constructor(
        @Inject(getRepositoryToken(VoteEntity)) private readonly voteRepo: Repository<VoteEntity>,
        @Inject(getRepositoryToken(UserProfileEntity)) private readonly userProfileRepo: Repository<UserProfileEntity>,
        @Inject(getRepositoryToken(PostEntity)) private readonly postRepo: Repository<PostEntity>
    ) {}

    async setVote(voteData: CreateUpdateVoteDto): Promise<VoteEntity> {
        const profile = await this.userProfileRepo.findOne({ where: { id: voteData.userProfileId } });
        if (!profile) {
            throw new Error(`User profile with ID ${voteData.userProfileId} not found`);
        }
        const post = await this.postRepo.findOne({ where: { id: voteData.postId } });
        if (!post) {
            throw new Error(`Post with ID ${voteData.postId} not found`);
        }
        const existingVote = await this.voteRepo.findOne({
            where: {
                userProfile: { id: voteData.userProfileId },
                post: { id: voteData.postId }
            }
        });
        if (existingVote) {
            let finalVoteValue: boolean | undefined = !!voteData.value;
            if( existingVote.value === voteData.value && existingVote.value !== null) {
                finalVoteValue = undefined; // Toggle to null if the same vote is set again
            }
            const updatedVote: Partial<VoteEntity> = {
                post: post,
                userProfile: profile,
                value: finalVoteValue,
                updatedAt: new Date()
            };
            // If the vote already exists, update it
            await this.voteRepo.update(existingVote.id, updatedVote);
            const vote = await this.voteRepo.findOne({ where: { id: existingVote.id } , relations: ['post', 'userProfile'] });
            if (!vote) {
                throw new Error(`Vote with ID ${existingVote.id} not found after update`);
            }   
            return vote;
        }
        // If the vote doesn't exist, create a new one
        const newVote = this.voteRepo.create({
            ...voteData,
            post: post,
            userProfile: profile,
        });
        const finalVote = await this.voteRepo.save(newVote);
        return finalVote;
    }

    async getVoteCountsByPostId(postId: string): Promise<{ upvotes: number; downvotes: number, votes: { upvotes: VoteEntity[]; downvotes: VoteEntity[] } }> {
        const upvotes = await this.voteRepo.find({
            where: {
                post: { id: postId },
                value: true 
            },
            relations: ['post', 'userProfile']
        });
        const downvotes = await this.voteRepo.find({
            where: {
                post: { id: postId },
                value: false
            },
            relations: ['post', 'userProfile']
        });
        return { upvotes: upvotes.length, downvotes: downvotes.length, votes: { upvotes, downvotes } };
    }

    async getUserVoteCounts(userProfileId: string): Promise<{ upvotes: number; downvotes: number }> {
        const upvotes = await this.voteRepo.count({
            where: {
                userProfile: { id: userProfileId },
                value: true 
            }
        });
        const downvotes = await this.voteRepo.count({
            where: {
                userProfile: { id: userProfileId },
                value: false
            }
        });
        return { upvotes, downvotes };
    }

}
