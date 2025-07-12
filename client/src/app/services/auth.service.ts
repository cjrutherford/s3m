import { Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileType } from './user-profile';

export type UserType =  { userId: string, email: string, iat: number, exp: number }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = '/api/auth';
  constructor(private readonly http: HttpClient) {}
  token = signal<string | null>(localStorage.getItem('authToken') ?? null);
  user = signal<UserType | null>(null);
  profile = signal<ProfileType | null>(null);

  isLoggedIn(): boolean {
    // Check the signal first, then fallback to localStorage
    return !!this.token() || !!localStorage.getItem('authToken');
  }

  getLoggedInProfileId(): string | null {
    // Try to get from user signal first
    const user = this.profile();
    if (!user) {
      console.warn("No user found in AuthService");
      const localUser = localStorage.getItem('userProfile');
      if (localUser) {
        const parsedLocalUser = JSON.parse(localUser);
        this.profile.set(parsedLocalUser);
        if (parsedLocalUser?.id) {
          return parsedLocalUser.id;
        }
      }
      return null;
    }
    return user.id;
  }

  setProfile(profile: ProfileType): void {
    this.profile.set(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }

  getAuthToken(): string | null {
    // Return the signal value if set, otherwise check localStorage
    return this.token() ?? localStorage.getItem('authToken');
  }

  setAuthToken(token: string): void {
    this.token.set(token);
    localStorage.setItem('authToken', token);
  }

  clearAuthToken(): void {
    this.token.set(null);
    localStorage.removeItem('authToken');
  }

  setUser(user: UserType, profile: ProfileType): void {
    this.user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.profile.set(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }

  getUser(): UserType | null {
    return this.user();
  }

  getUserProfile(): ProfileType | null {
    return this.profile();
  }

  get tokenPayload(): UserType | null {
    const token = this.getAuthToken();
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  login(data: any): Observable<{ user: any, token: string }> {
    return this.http.post<{user: any, token: string}>(`${this.baseUrl}/login`, data);
  }
  register(data: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/register`, data);
  }
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }
  logout(): Observable<any> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    return this.http.post(`${this.baseUrl}/logout`, {});
  }
}
