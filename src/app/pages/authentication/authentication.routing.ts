import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { AuthenticationComponent } from './authentication.component';
import { RegisterComponent } from './register/register.component';
import { ActivateComponent } from './activate/activate.component';
import { LoginComponent } from './login/login.component';
import { ResendComponent } from './resend/resend.component';
import { ResetUsernameComponent } from './reset/reset-username/reset-username.component';
import { ResetPasswordComponent } from './reset/reset-password/reset-password.component';
import { NewPasswordComponent } from './reset/new-password/new-password.component';
import { NotAuthGuard } from '../guards/notAuth.guard';


const routes: Routes = [
  { path: '', component: LoginComponent,canActivate:[NotAuthGuard], pathMatch: 'full' },
  { path: 'sign-up-route', component: RegisterComponent,canActivate:[NotAuthGuard] },
  { path: 'activate-route/:temporaryToken', component: ActivateComponent,canActivate:[NotAuthGuard] },
  { path: 'sign-in-route', component: LoginComponent,canActivate:[NotAuthGuard] },          
  { path: 'resend-route', component: ResendComponent,canActivate:[NotAuthGuard] },
  { path: 'reset-username-route', component: ResetUsernameComponent,canActivate:[NotAuthGuard] },
  { path: 'reset-password-route', component: ResetPasswordComponent,canActivate:[NotAuthGuard] },
  { path: 'new-password-route/:token', component: NewPasswordComponent,canActivate:[NotAuthGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class CreateThemeRoutingModule { }

