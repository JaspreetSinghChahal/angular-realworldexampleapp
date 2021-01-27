import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { AlertService } from 'src/app/services/alert.service';
import { PromoCodeBatchDetails } from 'src/app/models/promocode-batch-details';
import { finalize } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Brand } from 'src/app/models/brand';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-create-promocode',
  templateUrl: './create-promocode.component.html',
  styleUrls: ['./create-promocode.component.scss', '../../../shared/scss/style.scss']
})
export class CreatePromocodeComponent implements OnInit {

  promocodeForm: FormGroup;
  today: Date;
  created: boolean;
  batchId: string;
  allBrands: Brand[];
  promoCodeBatchDetails: PromoCodeBatchDetails;

  // convenience getter for easy access to form fields
  get data() { return this.promocodeForm.controls; }

  constructor
    (
      private formBuilder: FormBuilder,
      private dashboardService: DashboardService,
      private promocodeService: PromocodesService,
      private progressService: ProgressService,
      private elRef: ElementRef,
      private alertservice: AlertService,
      private utilityService: UtilityService
    ) {
    this.today = new Date();
    this.setFormGroup();
  }

  ngOnInit() {
    this.getAllBrands();
  }


  public getAllBrands() {
    let progressRef = this.progressService.showProgress(this.elRef);

    this.dashboardService.loadBrands('', 'brandName', 'asc', 0, 100)
      .pipe(
        finalize(() => this.progressService.detach(progressRef))
      ).subscribe(result => {
        this.allBrands = result;
      });
  }

  /**
   * update user data 
   */
  public createPromocode() {
    if (!this.promocodeForm.valid) {
      return;
    }
    let progressRef = this.progressService.showProgress(this.elRef);
    // create user object
    this.promoCodeBatchDetails = new PromoCodeBatchDetails();
    this.promoCodeBatchDetails.batchName = this.data.batchName.value;
    this.promoCodeBatchDetails.brandId = this.data.brandId.value;
    this.promoCodeBatchDetails.loyaltyPoints = this.data.loyaltyPoints.value;
    this.promoCodeBatchDetails.noOfPromoCodes = this.data.noOfPromoCodes.value;
    this.promoCodeBatchDetails.expirationDateTime = this.data.expirationDateTime.value;

    this.promocodeService.createPromocode(this.promoCodeBatchDetails)
      .pipe(
        finalize(() => this.progressService.detach(progressRef))
      )
      .subscribe(
        response => {
          this.created = true;
          this.promoCodeBatchDetails.batchId = response;
          this.showSuccessMessage();
        },
        error => {
          this.utilityService.showErrorMessage(error);
        });
  }

  /**
  * To create user form and add validations
  */
  private setFormGroup() {
    this.promocodeForm = this.formBuilder.group({
      batchName: ['', Validators.required],
      brandId: ['', Validators.required],
      loyaltyPoints: ['', Validators.required],
      noOfPromoCodes: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
      expirationDateTime: ['', Validators.required]
    });
  }

  /**
  * Show success message
  */
  private showSuccessMessage() {
    const dialogRef = this.alertservice.openSuccessModal("Record added Successfully");
    dialogRef.afterClosed().subscribe(dialogResult => {
    });
  }

}