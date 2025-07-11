import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { VoteService } from './vote.service';
import { CreateUpdateVoteDto, VoteEntity } from '../database/entities';
import { AuthGuard } from '../authentication/auth/auth.guard';
import User, { UserType } from '../authentication/user.decorator';

@UseGuards(AuthGuard)
@Controller('vote')
export class VoteController {
    constructor(
        private readonly voteService: VoteService,
        private readonly usersService: UsersService
    ) {}

    @Put()
    async setVote(
        @User() user: UserType,
        @Body() voteData: CreateUpdateVoteDto
    ): Promise<VoteEntity> {
        const userProfile = await this.usersService.getUserProfile(user.userId);
        if (!userProfile) {
            throw new Error(`User profile not found for user ID: ${user.userId}`);
        }
        if (userProfile.id !== voteData.userProfileId) {
            throw new Error('You can only set votes for your own profile');
        }
        return this.voteService.setVote(voteData);
    }

    @Get('post/:postId/counts')
    async getVoteCounts(
        @Param('postId') postId: string
    ): Promise<{ upvotes: number; downvotes: number }> {
        return this.voteService.getVoteCountsByPostId(postId);
    }
    @Get('profile/:userProfileId/counts')
    async getUserVoteCounts(@Param('userProfileId') userProfileId: string): Promise<{ upvotes: number; downvotes: number }> {
        return this.voteService.getUserVoteCounts(userProfileId);
    }
}
