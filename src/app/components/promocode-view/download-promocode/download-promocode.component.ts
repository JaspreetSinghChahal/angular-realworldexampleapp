import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { saveAs } from 'file-saver';
import { PromoCodeBatchDetails } from 'src/app/models/promocode-batch-details';
import { ThemePalette } from '@angular/material/core';
import { AlertService } from 'src/app/services/alert.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { finalize } from 'rxjs/operators';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-download-promocode',
  templateUrl: './download-promocode.component.html',
  styleUrls: ['./download-promocode.component.scss', '../../../shared/scss/style.scss']
})
export class DownloadPromocodeComponent implements OnInit {
  @Input()
  public enabled: boolean;

  @Input()
  public promoCodeBatchDetails: PromoCodeBatchDetails;

  public enable: boolean
  public downloadQrCodeForm: FormGroup;
  public color: ThemePalette = 'primary';
  public touchUi = false;

  constructor(private formBuilder: FormBuilder,
    private progressService: ProgressService,
    private promocodeService: PromocodesService,
    private elRef: ElementRef,
    private alertService: AlertService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.setFormGroup();
  }

  ngOnChanges() {
    if (this.downloadQrCodeForm == undefined) {
      return;
    }
    if (this.enabled == false) {
      this.data.colorCtr.disable();
    } else {
      this.data.colorCtr.enable();
    }
  }



  // convenience getter for easy access to form fields
  get data() { return this.downloadQrCodeForm.controls; }

  public downloadQRCode() {
    let progressRef = this.progressService.showProgress(this.elRef);
    let dimension = parseInt(this.data.height.value);
    this.promocodeService.downloadQRCode(this.promoCodeBatchDetails.batchId, dimension, dimension, this.data.colorCtr.value.hex).pipe(
      finalize(() => this.progressService.detach(progressRef))
    ).subscribe(
      blob => {
        saveAs(blob, this.promoCodeBatchDetails.batchName + ".zip");
      },
      error => {
        this.utilityService.showErrorMessage("An unexpected error has occured");
      });
  }

  /**
   * To create user form and add validations
   */
  private setFormGroup() {
    this.downloadQrCodeForm = this.formBuilder.group({
      height: ['256', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
      colorCtr: [{ value: '#000000', disabled: !this.enable }, Validators.required]
    });
  }

}
