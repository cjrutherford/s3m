import { CreateFollowDto, DeleteFollowDto, FollowDto } from '../dto';
import { Observable, of } from 'rxjs';

import { Follow } from './follow';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FollowService {
  baseUrl = '/api/follow';
  constructor(private readonly http: HttpClient) {}

  followers(profileId: string): Observable<FollowDto[]> {
    return this.http.get<FollowDto[]>(`${this.baseUrl}/followers/${profileId}`);
  }
  following(profileId: string): Observable<FollowDto[]> {
    return this.http.get<FollowDto[]>(`${this.baseUrl}/following/${profileId}`);
  }
  follow(followData: CreateFollowDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/follow`, followData);
  }

  unfollow(followData: DeleteFollowDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/unfollow`, followData);
  }
}
