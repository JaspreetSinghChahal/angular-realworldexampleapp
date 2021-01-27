import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { PromoCodes } from 'src/app/models/promocodes';
import { AlertService } from 'src/app/services/alert.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-promocode-info',
  templateUrl: './promocode-info.component.html',
  styleUrls: ['./promocode-info.component.scss', '../../../shared/scss/style.scss']
})
export class PromocodeInfoComponent implements OnInit {

  @Input()
  public promocodeNumber: number;

  public promocodeInfo: PromoCodes;
  public isScanned: string;

  constructor(
    private promocodesService: PromocodesService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private alertservice: AlertService
  ) {
  }

  ngOnInit(): void {
    this.getPromocodeInfo(this.promocodeNumber);
  }


  /**
   * Get details of a user
   * @param userId 
   */
  private getPromocodeInfo(userId: number) {
    let progressRef = this.progressService.showProgress(this.elRef);

    // User data
    this.promocodesService.promoccodeInfo(this.promocodeNumber).pipe(
      finalize(() => this.progressService.detach(progressRef))
    ).subscribe(result => {
      this.promocodeInfo = result;
      this.isScanned = this.IsScannedValue(this.promocodeInfo.isScanned);
    });
  }


  private IsScannedValue(isScanned: boolean) {
    if (isScanned === true) {
      return "Yes";
    } else {
      return "No";
    }
  }

}
