import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'reclamations',
    loadComponent: () => import('./reclamations/reclamation-list/reclamation-list').then(m => m.ReclamationList),
    canActivate: [authGuard]
  },
  {
    path: 'reclamations/new',
    loadComponent: () => import('./reclamations/reclamation-form/reclamation-form').then(m => m.ReclamationForm),
    canActivate: [authGuard]
  },
  {
    path: 'reclamations/:id',
    loadComponent: () => import('./reclamations/reclamation-detail/reclamation-detail').then(m => m.ReclamationDetail),
    canActivate: [authGuard]
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./admin/user-list/user-list').then(m => m.UserList),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: 'auth/login' }
];