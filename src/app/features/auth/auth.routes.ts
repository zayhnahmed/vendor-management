import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth.page/auth.page';
import { LoginPage } from './pages/login.page/login.page';

export const routes: Routes = [
  {
    path: '',
    component: AuthPage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
];
