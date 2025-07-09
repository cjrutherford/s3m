import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { ApiProperty } from '@nestjs/swagger';
import UserProfileEntity from "./user-profile.entity";

@Entity()
export default class FollowEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @ManyToOne(() => UserProfileEntity, userProfile => userProfile.followers)
    follower: UserProfileEntity;

    @ManyToOne(() => UserProfileEntity, userProfile => userProfile.following)
    following: UserProfileEntity;
}

export class FollowDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ required: false })
    updatedAt?: Date;

    @ApiProperty()
    followerId: string;

    @ApiProperty()
    followingId: string;
}

export class CreateFollowDto {
    @ApiProperty()
    followerId: string;

    @ApiProperty()
    followingId: string;
}

export class DeleteFollowDto {
    @ApiProperty()
    followerId: string;

    @ApiProperty()
    followingId: string;
}