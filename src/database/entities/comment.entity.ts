import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { ApiProperty } from '@nestjs/swagger';
import PostEntity from "./post.entity";
import UserProfileEntity from "./user-profile.entity";

@Entity()
export default class CommentEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => PostEntity, post => post.comments)
    post: PostEntity;

    @ManyToOne(() => UserProfileEntity, userProfile => userProfile.comments)
    userProfile: UserProfileEntity;
}

export class CommentDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ required: false })
    updatedAt?: Date;

    @ApiProperty()
    content: string;

    @ApiProperty()
    postId: string;

    @ApiProperty()
    userProfileId: string;
}

export class CreateCommentDto {
    @ApiProperty()
    content: string;

    @ApiProperty()
    postId: string;

    @ApiProperty()
    userProfileId: string;
}

export class UpdateCommentDto {
    @ApiProperty({ required: false })
    content?: string;

    @ApiProperty({ required: false })
    postId?: string;

    @ApiProperty({ required: false })
    userProfileId?: string;
}