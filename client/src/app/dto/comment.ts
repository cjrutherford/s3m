import { ProfileType } from "../services/user-profile";

export default interface CommentDto {
    id: string;
    createdAt: Date;
    updatedAt?: Date;
    content: string;
    postId: string;
    userProfile: ProfileType;
}

export interface CreateCommentDto {
    content: string;
    postId: string;
    userProfileId: string;
}

export interface UpdateCommentDto {
    content?: string;
    postId?: string;
    userProfileId?: string;
}