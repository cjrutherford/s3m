import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard } from '../authentication/auth/auth.guard';
import { CreateFollowDto, DeleteFollowDto } from '../database/entities';

@UseGuards(AuthGuard)
@Controller('follow')
export class FollowController {
    constructor(
        private readonly followService: FollowService,
    ) {}

    @Post('follow')
    async followUser(@Body() follow: CreateFollowDto) {
        return await this.followService.followUser(follow);
    }

    @Post('unfollow')
    async unfollowUser(@Body() follow: DeleteFollowDto) {
        return await this.followService.unfollowUser(follow);
    }

    @Get('followers/:userId')
    async getFollowers(@Param('userId') userId: string) {
        const followers = await this.followService.getFollowers(userId);
        console.log("🚀 ~ FollowController ~ getFollowers ~ followers:", followers)
        return followers;
    }

    @Get('following/:userId')
    async getFollowing(@Param('userId') userId: string) {
        const following = await this.followService.getFollowing(userId);
        console.log("🚀 ~ FollowController ~ getFollowing ~ following:", following)
        return following;
    }
}
