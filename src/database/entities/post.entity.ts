import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ApiProperty } from '@nestjs/swagger';
import CommentEntity from "./comment.entity";
import UserProfileEntity from "./user-profile.entity";
import VoteEntity from "./vote.entity";

@Entity()
export default class PostEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => UserProfileEntity, userProfile => userProfile.posts)
    userProfile: UserProfileEntity;

    @OneToMany(() => CommentEntity, comment => comment.post)
    comments: CommentEntity[];

    @OneToMany(() => VoteEntity, vote => vote.post)
    votes: VoteEntity[];
}

export class PostDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ required: false })
    updatedAt?: Date;

    @ApiProperty()
    content: string;

    @ApiProperty()
    userProfileId: string;
}

export class CreatePostDto {
    @ApiProperty()
    content: string;

    @ApiProperty()
    userProfileId: string;
}

export class UpdatePostDto {
    @ApiProperty({ required: false })
    content?: string;

    @ApiProperty()
    userProfileId: string;
}

export class QueryPostDto {
    @ApiProperty({ required: false })
    content?: string;

    @ApiProperty({ required: false })
    userProfileId?: string;
}