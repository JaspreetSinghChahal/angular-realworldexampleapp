import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { AlertService } from 'src/app/services/alert.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-terms-and-conditions-editor',
  templateUrl: './terms-and-conditions-editor.component.html',
  styleUrls: ['./terms-and-conditions-editor.component.scss', '../../../shared/scss/style.scss']
})
export class TermsAndConditionsEditorComponent implements OnInit {

  public termsAndConditionsForm: FormGroup;

  // convenience getter for easy access to form fields
  get data() { return this.termsAndConditionsForm.controls; }

  constructor(private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private alertservice: AlertService,
    private utilityService: UtilityService
  ) {
    this.setFormGroup();
  }

  ngOnInit(): void {
    this.getTermsAndConditions();
  }

  // editor configuration
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '350px',
    maxHeight: '350px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top'
  };

  /**
   * To create user form and add validations
   */
  private setFormGroup() {
    this.termsAndConditionsForm = this.formBuilder.group({
      termsAndConditionsEditor: ['', Validators.required],
    });
  }

  getTermsAndConditions() {
    let progressRef = this.progressService.showProgress(this.elRef);
    this.authService.getTermsAndConditions().pipe(
      finalize(() => this.progressService.detach(progressRef))
    ).subscribe(result => {
      if (result != null) {
        this.termsAndConditionsForm.setValue({ termsAndConditionsEditor: result.termsAndConditionsText });
      }
    });
  }

  /**
  * update Terms And Conditions data 
  */
  public updateTermsAndConditions() {
    if (!this.termsAndConditionsForm.valid) {
      return;
    }
    let progressRef = this.progressService.showProgress(this.elRef);

    this.authService.updateTermsAndConditions(this.data.termsAndConditionsEditor.value)
      .pipe(
        finalize(() => this.progressService.detach(progressRef))
      )
      .subscribe(
        response => {
          this.showSuccessMessage();
        },
        error => {
          this.utilityService.showErrorMessage(error);
        });
  }

  public cancel() {
    this.termsAndConditionsForm.reset();
    this.getTermsAndConditions();
  }

  private showSuccessMessage() {
    const dialogRef = this.alertservice.openSuccessModal("Record Updated Successfully");
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.getTermsAndConditions();
    });
  }


}
