import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss',  '../../../shared/scss/style.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public applicationName: string;
  public forgotPasswordForm: FormGroup;
  public waiting: boolean;
  public message: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private progressService: ProgressService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.applicationName = environment.applicationName;
    // form element attach validators
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });

  }

  // convenience getter for easy access to form fields
  get data() { return this.forgotPasswordForm.controls; }

  /**
   * Redirect to dashboard  on successful login
   */
  onSubmit() {
    if (!this.forgotPasswordForm.valid) {
      return;
    }
    let progressRef = this.progressService.showProgress(this.elRef);
    this.authService.forgotPasword(this.data.email.value)
      .pipe(
        finalize(() => this.progressService.detach(progressRef))
      )
      .subscribe(
        response => {
          this.message = response;
        },
        error => {
          alert('An Unexpected Error Occured.');
        });
  }
}