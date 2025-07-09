import { Routes } from '@angular/router';
import { authRoutes } from './pages/auth/auth.routes';

export const routes: Routes = [
    { path: 'auth', loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage), children: authRoutes },
    { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) },
    { path: 'feed', loadComponent: () => import('./pages/feed/feed').then(m => m.Feed) },
    { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About) },
    { path: 'following', loadComponent: () => import('./pages/following/following').then(m => m.Following) },
    { path: 'followers', loadComponent: () => import('./pages/followers/followers').then(m => m.Followers) },
    { path: '', redirectTo: '/feed', pathMatch: 'full' },
];
