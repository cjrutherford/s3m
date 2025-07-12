import { AuthGuard } from './services/auth.guard';
import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';
import { profileGuard } from './profile-guard';

export const routes: Routes = [
    { path: 'auth', loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage), children: authRoutes },
    { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile), canActivate: [AuthGuard] },
    { path: 'profile/:id', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile), canActivate: [AuthGuard] },
    { path: 'feed', loadComponent: () => import('./pages/feed/feed').then(m => m.Feed), canActivate: [AuthGuard, profileGuard] },
    // { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About) },
    { path: 'following', loadComponent: () => import('./pages/following/following').then(m => m.Following), canActivate: [AuthGuard, profileGuard] },
    { path: 'followers', loadComponent: () => import('./pages/followers/followers').then(m => m.Followers), canActivate: [AuthGuard, profileGuard] },
    { path: '', redirectTo: '/feed', pathMatch: 'full' },
];
