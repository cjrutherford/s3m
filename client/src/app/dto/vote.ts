import PostDto from "./post";
import { ProfileType } from "../services/user-profile";

export default interface VoteDto {
    id: string;
    createdAt: Date;
    updatedAt?: Date;
    value?: boolean; // true for upvote, false for downvote, null for no vote
    userProfile: ProfileType;
    post: PostDto;
}