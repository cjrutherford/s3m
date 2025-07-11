import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VoteDto } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class Vote {
  baseUrl: string = '/api/vote';

  constructor(private readonly http: HttpClient) {}

  setVote(voteData: { userProfileId: string; postId: string; voteType?: 'upvote' | 'downvote' }) {
    return this.http.put<VoteDto>(`${this.baseUrl}`, voteData);
  }

  getVoteCountsByPostId(postId: string) {
    return this.http.get<{ upvotes: number; downvotes: number, votes: { upvotes: VoteDto[]; downvotes: VoteDto[] } }>(`${this.baseUrl}/post/${postId}/counts`);
  }

  getUserVoteOnPost(userProfileId: string) {
    return this.http.get<{ voteType: 'upvote' | 'downvote' | null }>(`${this.baseUrl}/profile/${userProfileId}/counts`);
  }
}
