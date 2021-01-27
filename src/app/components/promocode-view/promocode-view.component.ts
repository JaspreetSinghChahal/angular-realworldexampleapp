import { Component, OnInit, ElementRef } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { saveAs } from 'file-saver';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AlertService } from 'src/app/services/alert.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-promocode-view',
  templateUrl: './promocode-view.component.html',
  styleUrls: ['./promocode-view.component.scss', '../../shared/scss/style.scss']
})
export class PromocodeViewComponent implements OnInit {
  public showDetailedView = false;

  constructor(private router: Router,
    private promocodesService: PromocodesService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private alertservice: AlertService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
  }


  public onToggle(event: MatSlideToggleChange) {
    this.showDetailedView = event.checked;
  }

  public addPromocode() {
    this.router.navigateByUrl('/addpromocodes');
  }

  downloadPromocode() {
    let progressRef = this.progressService.showProgress(this.elRef);
    this.promocodesService.downloadPromocodes().pipe(
      finalize(() => this.progressService.detach(progressRef))
    ).subscribe(
      blob => {
        saveAs(blob, "promocodes.xlsx");
      },
      error => {
        this.utilityService.showErrorMessage("An unexpected error occured");
      });
  }
}
