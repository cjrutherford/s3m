import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Follow {
  baseUrl: string = '/api/follow';

  constructor(private readonly http: HttpClient) {}

  followUser(followData: { profileId: string; followerId: string }) {
    return this.http.post(`${this.baseUrl}/follow`, followData);
  }

  unfollowUser(followData: { profileId: string; followerId: string }) {
    return this.http.post(`${this.baseUrl}/unfollow`, followData);
  }

  getFollowers(profileId: string) {
    return this.http.get(`${this.baseUrl}/followers/${profileId}`);
  }

  getFollowing(profileId: string) {
    return this.http.get(`${this.baseUrl}/following/${profileId}`);
  }
}
