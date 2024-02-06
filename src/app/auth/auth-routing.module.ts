import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmMailComponent } from './confirm-mail/confirm-mail.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { RegisterComponent } from './register/register.component';
import { InfoComponent } from './info/info.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecoverPasswordPhoneComponent } from './recover-password-phone/recover-password-phone.component';
import { InvitingRegisterComponent } from './inviting-register/inviting-register.component';
import { InvitingVendorComponent } from './inviting-vendor/inviting-vendor.component';
import { JoinCompanyComponent } from './join-company/join-company.component';
import { TermsComponent } from './terms/terms.component';
import { PolicyComponent } from './policy/policy.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'info',
    component: InfoComponent
  },
  {
    path: 'lock-screen',
    component: LockScreenComponent
  },
  {
    path: 'confirm-mail',
    component: ConfirmMailComponent
  },
  {
    path: 'recover-password',
    component: RecoverPasswordComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'forgot',
    component: ResetPasswordComponent
  },
  {
    path: 'recover-password-phone',
    component: RecoverPasswordPhoneComponent
  },
  {
    path: 'inviting-register',
    component: InvitingRegisterComponent
  },
  {
    path: 'inviting-vendor',
    component: InvitingVendorComponent
  },
  {
    path: 'join-company',
    component: JoinCompanyComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'policy',
    component: PolicyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
