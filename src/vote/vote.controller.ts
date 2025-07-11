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
        console.log('Setting vote for user:', user);
        const userProfile = await this.usersService.getUserProfile(user.userId);
        console.log('User Profile retrieved:', userProfile);
        if (!userProfile) {
            throw new Error(`User profile not found for user ID: ${user.userId}`);
        }
        if (userProfile.id !== voteData.userProfileId) {
            throw new Error('You can only set votes for your own profile');
        }
        console.log('Vote data:', voteData);
        console.log('setting vote for post:', voteData.postId);
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
