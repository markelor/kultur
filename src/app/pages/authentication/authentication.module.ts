import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CreateThemeRoutingModule }  from './authentication.routing';
import { AuthenticationComponent } from './authentication.component'
import { RegisterComponent } from './register/register.component';
import { ActivateComponent } from './activate/activate.component';
import { LoginComponent } from './login/login.component';
import { ResendComponent } from './resend/resend.component';
import { NewPasswordComponent } from './reset/new-password/new-password.component';
import { ResetPasswordComponent } from './reset/reset-password/reset-password.component';
import { ResetUsernameComponent } from './reset/reset-username/reset-username.component';
import { SharedModule } from "../../shared/shared.module";
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
@NgModule({
  imports: [
  	CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    CreateThemeRoutingModule
  ],
  declarations: [AuthenticationComponent,RegisterComponent,ActivateComponent,LoginComponent,ResendComponent, NewPasswordComponent, ResetPasswordComponent, ResetUsernameComponent],
  providers: [
   {provide: COMPOSITION_BUFFER_MODE, useValue: false}
  ]
})
export class AuthenticationModule { }
