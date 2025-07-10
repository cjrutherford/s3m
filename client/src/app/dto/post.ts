import CommentDto from "./comment";
import { ProfileType } from "../services/user-profile";
import VoteDto from "./vote";

export default interface PostDto {
    id: string;
    createdAt: Date;
    updatedAt?: Date;
    content: string;
    userProfile: ProfileType;
    comments?: CommentDto[];
    votes?: VoteDto[];
}

export interface CreatePostDto {
    content: string;
    userProfileId: string;
}

export interface UpdatePostDto {
    content?: string;
    userProfileId?: string;
}