import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import CommentEntity from './comment.entity';
import FollowEntity from './follow.entity';
import PostEntity from './post.entity';
import UserEntity from './user.entity';
import VoteEntity from './vote.entity';

@Entity()
export default class UserProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    profilePictureUrl?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @JoinColumn({ name: 'userId' }) // This side owns the relation
    @OneToOne(() => UserEntity, user => user.profile)
    user: UserEntity;

    @OneToMany(() => PostEntity, post => post.userProfile)
    posts: PostEntity[];

    @OneToMany(() => CommentEntity, comment => comment.userProfile)
    comments: CommentEntity[];

    @OneToMany(() => VoteEntity, vote => vote.userProfile)
    votes: VoteEntity[];

    @OneToMany(() => FollowEntity, follow => follow.follower)
    followers: FollowEntity[];

    @OneToMany(() => FollowEntity, follow => follow.following)
    following: FollowEntity[];
}

@ApiTags('user-profiles')
export class CreateUserProfileDto {
    @ApiProperty()
    userId: string;

    @ApiProperty({ required: false })
    name?: string;

    @ApiProperty({ required: false })
    bio?: string;

    @ApiProperty({ required: false })
    profilePictureUrl?: string;
}

@ApiTags('user-profiles')
export class UpdateUserProfileDto {
    @ApiProperty({ required: false })
    name?: string;

    @ApiProperty({ required: false })
    bio?: string;

    @ApiProperty({ required: false })
    profilePictureUrl?: string;
}

@ApiTags('user-profiles')
export class UserProfileDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ required: false })
    name?: string;

    @ApiProperty({ required: false })
    bio?: string;

    @ApiProperty({ required: false })
    profilePictureUrl?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ required: false })
    updatedAt?: Date;
}