import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../pages/profile/profile';

export interface CreateUserProfileDto {
    name: string;
    bio: string;
    profilePictureUrl: string;
}

export declare type ProfileType = {
  id: string;
  name: string;
  bio: string;
  profilePictureUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfile {
  private readonly baseUrl = '/api/users';

  constructor(private readonly http: HttpClient) { }

  getUserProfile() {
    return this.http.get<ProfileType>(`${this.baseUrl}`);
  }

  getUserProfileById(userId: string) {
    return this.http.get<ProfileType>(`${this.baseUrl}/${userId}`);
  }

  getUserProfileByProfileId(profileId: string) {
    return this.http.get<ProfileType>(`${this.baseUrl}/profile/${profileId}`);
  }

  createUserProfile(profileData: CreateUserProfileDto) {
    return this.http.post<ProfileType>(`${this.baseUrl}`, profileData);
  }

  updateUserProfile(profileData: CreateUserProfileDto) {
    return this.http.put<ProfileType>(`${this.baseUrl}`, profileData);
  }

  deleteUserProfile() {
    return this.http.delete(`${this.baseUrl}`);
  }
}
