import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { PromoCodesScanDataSource } from './promocode-scan-datasource';
import { Constants } from 'src/app/shared/interceptors/constants';

@Component({
  selector: 'app-promocode-scan',
  templateUrl: './promocode-scan.component.html',
  styleUrls: ['./promocode-scan.component.scss', '../../../shared/scss/style.scss']
})
export class PromocodeScanComponent implements OnInit {

  @Input()
  promocodeNumber: number;

  dataSource: PromoCodesScanDataSource;
  displayedColumns = ["username", "scannedDateTime", "isSuccess"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private promoCodesService: PromocodesService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource = new PromoCodesScanDataSource(this.promoCodesService);
    this.subscribeToLoader();
    this.dataSource.loadPromoCodesScanActivity(this.promocodeNumber);

  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(Constants.DebounceTime),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPromoCodesScanPage(this.promocodeNumber);
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadPromoCodesScanPage(this.promocodeNumber))
      ).subscribe();

  }

  paginate() {
    this.loadPromoCodesScanPage(this.promocodeNumber);
  }

  /**
   * Get list of all users
   */
  loadPromoCodesScanPage(promocodeNumber: number) {
    this.dataSource.loadPromoCodesScanActivity(
      promocodeNumber,
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
