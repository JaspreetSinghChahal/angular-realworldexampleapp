import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { PromoCodeBatchDetails } from 'src/app/models/promocode-batch-details';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { AlertService } from 'src/app/services/alert.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-batch-promocode-info',
  templateUrl: './batch-promocode-info.component.html',
  styleUrls: ['./batch-promocode-info.component.scss', '../../../shared/scss/style.scss']
})
export class BatchPromocodeInfoComponent implements OnInit {

  @Input()
  public batchId: string;

  public promocodeInfo: PromoCodeBatchDetails;
  public isScanned: string;
  public downloadEnabled: boolean;


  constructor(
    private promocodesService: PromocodesService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private alertservice: AlertService
  ) {
  }

  ngOnInit(): void {
    this.getPromocodeBatchInfo();
    this.downloadEnabled = true;
  }


  /**
   * Get details of a user
   * @param userId 
   */
  private getPromocodeBatchInfo() {
    let progressRef = this.progressService.showProgress(this.elRef);

    // User data
    this.promocodesService.promoccodeBatchInfo(this.batchId).pipe(
      finalize(() => this.progressService.detach(progressRef))
    ).subscribe(result => {
      this.promocodeInfo = result;
    });
  }

}