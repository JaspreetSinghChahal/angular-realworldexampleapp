import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { Brand } from 'src/app/models/brand';
import { finalize } from 'rxjs/internal/operators/finalize';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {

  brandForm: FormGroup;
  showEmail: boolean;

  // convenience getter for easy access to form fields
  get data() { return this.brandForm.controls; }

  constructor
    (
      private formBuilder: FormBuilder,
      private dashboardService: DashboardService,
      private progressService: ProgressService,
      private elRef: ElementRef,
      private dialogRef: MatDialogRef<AddBrandComponent>,
      private alertservice: AlertService,
      private utilityService: UtilityService
    ) {
    this.setFormGroup();
  }

  ngOnInit() {
  }

  /**
   * update user data 
   */
  public addBrand() {
    if (!this.brandForm.valid) {
      return;
    }
    let progressRef = this.progressService.showProgress(this.elRef);
    // create user object
    let brand = new Brand();
    brand.brandName = this.data.brandName.value;

    this.dashboardService.addBrand(brand)
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

  close() {
    this.dialogRef.close();
  }

  /**
  * To create user form and add validations
  */
  private setFormGroup() {
    this.brandForm = this.formBuilder.group({
      brandName: ['', Validators.required]
    });
  }


  /**
  * Show success message
  */
  private showSuccessMessage() {
    const dialogRef = this.alertservice.openSuccessModal("Record added Successfully");
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogRef.close();
    });
  }

}

