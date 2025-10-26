import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'internships',
        loadComponent: () =>
          import('../pages/internships/internships.page').then((m) => m.InternshipsPage),
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('../pages/applications/applications.page').then((m) => m.ApplicationsPage),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('../pages/notifications/notifications.page').then((m) => m.NotificationsPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
