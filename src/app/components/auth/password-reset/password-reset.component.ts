import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ResetPassword } from 'src/app/models/reset-Password';
import { AlertService } from 'src/app/services/alert.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss', '../../../shared/scss/style.scss']
})
export class PasswordResetComponent implements OnInit {

  public applicationName: string;
  public passwordResetForm: FormGroup;
  public waiting: boolean;
  public userId: string;
  public token: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private alertservice: AlertService,
    private utilityService:UtilityService
  ) { }

  ngOnInit() {
    this.applicationName = environment.applicationName;
    this.route.queryParams.subscribe(params => {
      this.userId = params['userid'];
      this.token = params['code'];
    });

    // form element attach validators
    this.passwordResetForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

  }

  // convenience getter for easy access to form fields
  get data() { return this.passwordResetForm.controls; }

  /**
   * Redirect to dashboard  on successful login
   */
  onSubmit() {
    if (!this.passwordResetForm.valid) {
      return;
    }
    let progressRef = this.progressService.showProgress(this.elRef);

    let resetpassword = new ResetPassword();
    resetpassword.userId = this.userId;
    resetpassword.password = this.data.password.value;
    resetpassword.token = this.token;

    this.authService.resetPassword(resetpassword)
      .pipe(
        finalize(() => this.progressService.detach(progressRef))
      )
      .subscribe(
        response => {
          if (response == "true") {
            this.showSuccessMessage();
          } else {
            this.utilityService.showErrorMessage("An Unexpected error has occured");
          }
        },
        error => {
          this.utilityService.showErrorMessage(error);
        });
  }

  /**
    * Show success message
    */
  private showSuccessMessage() {
    const dialogRef = this.alertservice.openSuccessModal("Password Updated Successfully");
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.router.navigateByUrl('/login');
    });
  }  

}