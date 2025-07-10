import { CommentDto, CreateCommentDto, UpdateCommentDto } from '../dto';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Comment {
  baseUrl: string = '/api/comment';

  constructor(private readonly http: HttpClient) {}

  createComment(createCommentDto: CreateCommentDto) {
    return this.http.post<CommentDto>(`${this.baseUrl}`, createCommentDto);
  }
  
  getCommentsByPostId(postId: string) {
    return this.http.get<CommentDto[]>(`${this.baseUrl}/post/${postId}`);
  }

  updateComment(commentId: string, updateCommentDto: UpdateCommentDto) {
    return this.http.put<CommentDto>(`${this.baseUrl}/${commentId}`, updateCommentDto);
  }

  deleteComment(commentId: string) {
    return this.http.delete<any>(`${this.baseUrl}/${commentId}`);
  }
  
}
