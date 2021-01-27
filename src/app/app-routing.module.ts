import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { UserdetailsComponent } from './components/userlist/userdetails/userdetails.component';
import { LayoutComponent } from './components/common/layout/layout.component';
import { PromocodeDetailsComponent } from './components/promocodes/promocode-details/promocode-details.component';
import { PromocodeViewComponent } from './components/promocode-view/promocode-view.component';
import { BatchPromocodeDetailsComponent } from './components/batch-promocodes/batch-promocode-details/batch-promocode-details.component';
import { CreatePromocodeComponent } from './components/promocode-view/create-promocode/create-promocode.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { PasswordResetComponent } from './components/auth/password-reset/password-reset.component';
import { AuthGuardService as AuthGuard } from './services/guards/auth-guard.service';
import { TermsAndConditionsComponent } from './components/auth/terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'userlist', component: UserlistComponent },
      { path: 'userlist/:id', component: UserdetailsComponent },
      { path: 'promocodes', component: PromocodeViewComponent },
      { path: 'promocodes/:id', component: PromocodeDetailsComponent },
      { path: 'batchpromocodes/:id', component: BatchPromocodeDetailsComponent },
      { path: 'addpromocodes', component: CreatePromocodeComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'password-recovery', component: ForgotPasswordComponent },
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'termsAndConditions', component: TermsAndConditionsComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
