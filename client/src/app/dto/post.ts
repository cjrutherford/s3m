import CommentDto from "./comment";
import VoteDto from "./vote";

export default interface PostDto {
    id: string;
    createdAt: Date;
    updatedAt?: Date;
    content: string;
    userProfileId: string;
    comments?: CommentDto[]; // Assuming comments is an array of objects
    votes?: VoteDto[]; // Assuming votes is an array of objects
}