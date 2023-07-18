import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { UiModule } from '../shared/ui/ui.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { ConfirmMailComponent } from './confirm-mail/confirm-mail.component';
import { LogoutComponent } from './logout/logout.component';
import { InfoComponent } from './info/info.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { provideNgxMask, IConfig, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CodeInputModule } from 'angular-code-input';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecoverPasswordPhoneComponent } from './recover-password-phone/recover-password-phone.component';
import { InvitingRegisterComponent } from './inviting-register/inviting-register.component';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RecoverPasswordComponent,
    LockScreenComponent,
    ConfirmMailComponent,
    LogoutComponent,
    InfoComponent,
    ResetPasswordComponent,
    RecoverPasswordPhoneComponent,
    InvitingRegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    UiModule,
    AuthRoutingModule,
    SweetAlert2Module,
    NgxMaskDirective,
     NgxMaskPipe,
    CodeInputModule,
    GoogleSigninButtonModule
  ],
  providers:[
    provideNgxMask()
  ]
})
export class AuthModule { }
