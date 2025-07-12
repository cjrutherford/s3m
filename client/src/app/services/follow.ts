import { CreateFollowDto, DeleteFollowDto, FollowDto } from '../dto'; // Adjust the import path as necessary

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Follow {
  baseUrl: string = '/api/follow';

  constructor(private readonly http: HttpClient) {}

  followUser(followData: CreateFollowDto) {
    return this.http.post(`${this.baseUrl}/follow`, followData);
  }

  unfollowUser(followData: DeleteFollowDto) {
    return this.http.post(`${this.baseUrl}/unfollow`, followData);
  }

  getFollowers(profileId: string) {
    return this.http.get<FollowDto[]>(`${this.baseUrl}/followers/${profileId}`);
  }

  getFollowing(profileId: string) {
    return this.http.get<FollowDto[]>(`${this.baseUrl}/following/${profileId}`);
  }
}
