import { getRepositoryToken } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import VoteEntity, { CreateUpdateVoteDto } from '../database/entities/vote.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VoteService {

    constructor(
        @Inject(getRepositoryToken(VoteEntity)) private readonly voteRepo: Repository<VoteEntity>
    ) {}

    async setVote(voteData: CreateUpdateVoteDto): Promise<VoteEntity> {
        const existingVote = await this.voteRepo.findOne({
            where: {
                userProfile: { id: voteData.userProfileId },
                post: { id: voteData.postId }
            }
        });
        if (existingVote) {
            const updatedVote = {
                ...existingVote,
                value: voteData.value,
                updatedAt: new Date() // Update the timestamp
            }
            // If the vote already exists, update it
            this.voteRepo.update(existingVote.id, updatedVote);
            const vote = await this.voteRepo.findOne({ where: { id: existingVote.id } });
            if (!vote) {
                throw new Error(`Vote with ID ${existingVote.id} not found after update`);
            }   
            return vote;
        }
        // If the vote doesn't exist, create a new one
        const newVote = this.voteRepo.create(voteData);
        return await this.voteRepo.save(newVote);
    }

    async getVoteCountsByPostId(postId: string): Promise<{ upvotes: number; downvotes: number }> {
        const upvotes = await this.voteRepo.count({
            where: {
                post: { id: postId },
                value: true 
            }
        });
        const downvotes = await this.voteRepo.count({
            where: {
                post: { id: postId },
                value: false
            }
        });
        return { upvotes, downvotes };
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
