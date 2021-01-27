import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { PromoCodesBatchScanDataSource } from './promocode-batch-scan-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Constants } from 'src/app/shared/interceptors/constants';

@Component({
  selector: 'app-batch-promocode-scan',
  templateUrl: './batch-promocode-scan.component.html',
  styleUrls: ['./batch-promocode-scan.component.scss']
})
export class BatchPromocodeScanComponent implements OnInit {

  @Input()
  batchId: string;

  dataSource: PromoCodesBatchScanDataSource;
  displayedColumns = ["promoCodeNumber", "username", "scannedDateTime", "isSuccess"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private promoCodesService: PromocodesService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource = new PromoCodesBatchScanDataSource(this.promoCodesService);
    this.subscribeToLoader();
    this.dataSource.loadPromoCodesBatchScanActivity(this.batchId);

  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(Constants.DebounceTime),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPromoCodesBatchScanPage(this.batchId);
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadPromoCodesBatchScanPage(this.batchId))
      ).subscribe();

  }

  paginate() {
    this.loadPromoCodesBatchScanPage(this.batchId);
  }

  /**
   * Get list of all users
   */
  loadPromoCodesBatchScanPage(batchId: string) {
    this.dataSource.loadPromoCodesBatchScanActivity(
      batchId,
      this.input.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }


  /**
   * Susbscribe to loader in datasource
   */
  subscribeToLoader() {
    let progressRef;
    this.dataSource.loading$.subscribe(
      show => {
        if (show == true) {
          progressRef = this.progressService.showProgress(this.elRef);
        }
        else {
          this.progressService.detach(progressRef);
        }
      });
  }
}
