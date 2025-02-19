import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminGuard } from './admin-dashboard/admin.guard';
import { UserGuard } from '../user.guard'; 

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] }, // Protect the admin route
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [UserGuard] }, // Protect the user route
  { path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) },
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
