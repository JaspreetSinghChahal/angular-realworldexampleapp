import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/auth/login/login.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { UserdetailsComponent } from './components/userlist/userdetails/userdetails.component';
import { UserInfoComponent } from './components/userlist/user-info/user-info.component';
import { UserReputationByBrandComponent } from './components/userlist/user-reputation-by-brand/user-reputation-by-brand.component';
import { UserScanActivityComponent } from './components/userlist/user-scan-activity/user-scan-activity.component';
import { ProgressSpinnerComponent } from './components/common/progress-spinner/progress-spinner.component';
import { DynamicOverlay } from './services/spinner/dynamic-overlay.service';
import { ProgressService } from './services/spinner/progress.service';
import { DynamicOverlayContainer } from './services/spinner/dynamic-overlay-container.service';
import { LayoutComponent } from './components/common/layout/layout.component';
import { NavbarComponent } from './components/common/layout/navbar/navbar.component';
import { HeaderComponent } from './components/common/layout/header/header.component';
import { CreateUserComponent } from './components/userlist/create-user/create-user.component';
import { AlertModalComponent } from './components/common/alert/alert-modal/alert-modal.component';
import { PromocodesComponent } from './components/promocodes/promocodes.component';
import { PromocodeInfoComponent } from './components/promocodes/promocode-info/promocode-info.component';
import { PromocodeDetailsComponent } from './components/promocodes/promocode-details/promocode-details.component';
import { PromocodeScanComponent } from './components/promocodes/promocode-scan/promocode-scan.component';
import { BatchPromocodesComponent } from './components/batch-promocodes/batch-promocodes.component';
import { PromocodeViewComponent } from './components/promocode-view/promocode-view.component';
import { BatchPromocodeInfoComponent } from './components/batch-promocodes/batch-promocode-info/batch-promocode-info.component';
import { BatchPromocodeScanComponent } from './components/batch-promocodes/batch-promocode-scan/batch-promocode-scan.component';
import { BatchPromocodeDetailsComponent } from './components/batch-promocodes/batch-promocode-details/batch-promocode-details.component';
import { BrandReputationComponent } from './components/dashboard/brand-reputation/brand-reputation.component';
import { CreatePromocodeComponent } from './components/promocode-view/create-promocode/create-promocode.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { PasswordResetComponent } from './components/auth/password-reset/password-reset.component';
import { BrandComponent } from './components/dashboard/brand/brand.component';
import { AddBrandComponent } from './components/dashboard/brand/add-brand/add-brand.component';
import { UserStatisticsComponent } from './components/dashboard/user-statistics/user-statistics.component';
import { DownloadPromocodeComponent } from './components/promocode-view/download-promocode/download-promocode.component';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { PromotionInfoComponent } from './components/dashboard/promotion-info/promotion-info.component';
import { TermsAndConditionsComponent } from './components/auth/terms-and-conditions/terms-and-conditions.component';
import { UserPointResetComponent } from './components/userlist/user-point-reset/user-point-reset.component';
import { TermsAndConditionsEditorComponent } from './components/dashboard/terms-and-conditions-editor/terms-and-conditions-editor.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    UserlistComponent,
    UserdetailsComponent,
    UserInfoComponent,
    UserReputationByBrandComponent,
    UserScanActivityComponent,
    NavbarComponent,
    LayoutComponent,
    HeaderComponent,
    ProgressSpinnerComponent,
    CreateUserComponent,
    AlertModalComponent,
    PromocodesComponent,
    PromocodeInfoComponent,
    PromocodeDetailsComponent,
    PromocodeScanComponent,
    BatchPromocodesComponent,
    PromocodeViewComponent,
    BatchPromocodeInfoComponent,
    BatchPromocodeScanComponent,
    BatchPromocodeDetailsComponent,
    BrandReputationComponent,
    CreatePromocodeComponent,
    ForgotPasswordComponent,
    PasswordResetComponent,
    BrandComponent,
    AddBrandComponent,
    UserStatisticsComponent,
    DownloadPromocodeComponent,
    PromotionInfoComponent,
    TermsAndConditionsComponent,
    UserPointResetComponent,
    TermsAndConditionsEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,
    NgxMatColorPickerModule,
    AngularEditorModule 
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    ProgressService, DynamicOverlay, DynamicOverlayContainer,
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ProgressSpinnerComponent]
})
export class AppModule { }
