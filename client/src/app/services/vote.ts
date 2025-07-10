import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Vote {
  baseUrl: string = '/api/vote';

  constructor(private readonly http: HttpClient) {}

  setVote(voteData: { userProfileId: string; postId: string; voteType?: 'upvote' | 'downvote' }) {
    return this.http.put(`${this.baseUrl}`, voteData);
  }

  getVoteCountsByPostId(postId: string) {
    return this.http.get<{ upvotes: number; downvotes: number }>(`${this.baseUrl}/post/${postId}/counts`);
  }

  getUserVoteOnPost(userProfileId: string) {
    return this.http.get<{ voteType: 'upvote' | 'downvote' | null }>(`${this.baseUrl}/profile/${userProfileId}/counts`);
  }
}
