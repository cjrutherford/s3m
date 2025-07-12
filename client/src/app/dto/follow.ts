// filepath: /home/cjrutherford/workspace/portfolio-projects/s3m/client/src/app/dto/follow.ts

import { ProfileType } from "../services/user-profile";

export interface FollowDto {
    id: string;
    createdAt: Date;
    updatedAt?: Date;
    follower: ProfileType;
    following: ProfileType;
}

export interface CreateFollowDto {
    followerId: string;
    followingId: string;
}

export interface DeleteFollowDto {
    followerId: string;
    followingId: string;
}