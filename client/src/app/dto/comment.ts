export default interface CommentDto {
    id: string;
    createdAt: Date;
    updatedAt?: Date;
    content: string;
    postId: string;
    userProfileId: string;
}