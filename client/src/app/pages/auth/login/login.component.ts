import { catchError, map, of, switchMap } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message';
import { Router } from '@angular/router';
import { UserProfile } from '../../../services/user-profile';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  error: string = '';

  constructor(
    private readonly auth: AuthService, 
    private readonly router: Router, 
    private readonly messageService: MessageService,
    private readonly profile: UserProfile,
  ) {}

  login() {
    this.auth.login(this.loginData)
    .pipe(switchMap(({token, user}) => {
      return this.profile.getUserProfile().pipe(
        map(profile => [token, user, profile]),
        catchError((err: any) => {
          console.error('Profile fetch error:', err);
          return of([token, user, null]);
        })
      );
    }))
    .subscribe({
      next: ([token, user, profile]) => {
        this.auth.setAuthToken(token);
        this.auth.setUser(user, profile);
        if (profile === null) {
          this.router.navigate(['/profile'], { queryParams: { edit: true } });
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => this.messageService.addMessage({
        content: `${err.error?.message}:${err.error?.error ?? 'Login failed.'}`,
        type: 'error' 
      })
    });
  }
}
