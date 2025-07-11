import { CreatePostDto, PostDto, UpdatePostDto } from '../dto';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Post {
  baseUrl: string = '/api/post';

  constructor(private readonly http: HttpClient) {}

  createPost(createPostDto: CreatePostDto) {
    return this.http.post<PostDto>(`${this.baseUrl}`, createPostDto);
  }

  updatePost(postId: string, updatePostDto: UpdatePostDto) {
    return this.http.put<PostDto>(`${this.baseUrl}/${postId}`, updatePostDto);
  }

  deletePost(postId: string) {
    return this.http.delete<any>(`${this.baseUrl}/${postId}`);
  }

  find(postQuery: {content?: string, userProfileId?: string}) {
    return this.http.post<PostDto[]>(`${this.baseUrl}/find`, postQuery);
  }
}
