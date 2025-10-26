import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing.page').then(m => m.LandingPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'internship-details',
    loadComponent: () => import('./pages/internship-details/internship-details.page').then(m => m.InternshipDetailsPage)
  },
  {
    path: 'apply',
    loadComponent: () => import('./pages/apply/apply.page').then(m => m.ApplyPage)
  },
  {
    path: 'my-internship',
    loadComponent: () => import('./pages/my-internship/my-internship.page').then(m => m.MyInternshipPage)
  },
  {
    path: 'logbook',
    loadComponent: () => import('./pages/logbook/logbook.page').then(m => m.LogbookPage)
  },
  {
    path: 'reviews',
    loadComponent: () => import('./pages/reviews/reviews.page').then(m => m.ReviewsPage)
  },
];
