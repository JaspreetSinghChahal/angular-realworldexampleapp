import { Component, OnInit, ElementRef } from '@angular/core';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(private progressService: ProgressService,
    private elRef: ElementRef,
    private authService: AuthenticationService) { }

  public termsAndConditions: string;

  ngOnInit(): void {
    this.getTermsAndConditions();
  }

  getTermsAndConditions() {
    let progressRef = this.progressService.showProgress(this.elRef);

    // User data
    this.authService.getTermsAndConditions().pipe(
      finalize(() => this.progressService.detach(progressRef))
    ).subscribe(result => {
      this.termsAndConditions = result.termsAndConditionsText;
    });
  }

}
