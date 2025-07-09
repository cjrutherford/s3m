export default interface VoteDto {
    id: string;
    createdAt: Date;
    updatedAt?: Date;
    value?: boolean; // true for upvote, false for downvote, null for no vote
    userProfileId: string;
    postId: string;
}