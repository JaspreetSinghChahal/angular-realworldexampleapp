import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ProgressService } from 'src/app/services/spinner/progress.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../shared/scss/style.scss']
})
export class LoginComponent implements OnInit {
  public applicationName: string;
  public loginForm: FormGroup;
  public waiting: boolean;
  public hidePassword: boolean;
  public loginErrorMsg: string;
  public isTermsAndConditonsAccepted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private progressService: ProgressService,
    private elRef: ElementRef
  ) {
    this.hidePassword = true;
  }

  ngOnInit() {
    this.applicationName = environment.applicationName;
    // form element attach validators
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  // convenience getter for easy access to form fields
  get data() { return this.loginForm.controls; }

  /**
   * Redirect to dashboard  on successful login
   */
  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    this.isTermsAndConditonsAccepted = true;
    let progressRef = this.progressService.showProgress(this.elRef);
    this.authService.login(this.data.username.value, this.data.password.value, this.isTermsAndConditonsAccepted)
      .pipe(
        finalize(() => this.progressService.detach(progressRef))
      )
      .subscribe(
        response => {
          this.router.navigateByUrl('/userlist');
        },
        error => {
          if (error.status === 400) {
            this.loginErrorMsg = error.error.value;
          }
          else {
            alert('An Unexpected Error Occured.');
          }
        });
  }
}
