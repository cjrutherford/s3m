import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const profileGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Try to get profile from signal or localStorage
  let profile = authService.getUserProfile();
  if (!profile) {
    const localProfile = localStorage.getItem('userProfile');
    if (localProfile) {
      authService.setProfile(JSON.parse(localProfile));
      profile = authService.getUserProfile();
    }
  }

  // If still no profile, redirect to profile edit
  if (!profile) {
    router.navigate(['/profile'], { queryParams: { edit: true } });
    return false;
  }

  // Optionally, check for required fields
  if (!profile.name || !profile.bio) {
    router.navigate(['/profile'], { queryParams: { edit: true } });
    return false;
  }

  return true;
};
