import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ApiProperty } from '@nestjs/swagger';
import PostEntity from "./post.entity";
import UserProfileEntity from "./user-profile.entity";

@Entity()
export default class VoteEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @Column({ type: 'boolean', nullable: true })
    value?: boolean; // true for upvote, false for downvote, null for no vote

    @ManyToOne(() => UserProfileEntity, userProfile => userProfile.votes)
    userProfile: UserProfileEntity;

    @ManyToOne(() => PostEntity, post => post.votes)
    post: PostEntity;
}

export class VoteDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ required: false })
    updatedAt?: Date;

    @ApiProperty({ required: false })
    value?: boolean;

    @ApiProperty()
    userProfileId: string;
}

export class CreateUpdateVoteDto {
    @ApiProperty({ required: false })
    value?: boolean; // true for upvote, false for downvote, null for no vote

    @ApiProperty()
    userProfileId: string;

    @ApiProperty()
    postId: string;
}