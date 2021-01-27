import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PromoCodesDataSource } from './promocodesDataSource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { PromoCodes } from 'src/app/models/promocodes';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertService } from 'src/app/services/alert.service';
import { Constants } from 'src/app/shared/interceptors/constants';

@Component({
  selector: 'app-promocodes',
  templateUrl: './promocodes.component.html',
  styleUrls: ['./promocodes.component.scss', '../../shared/scss/style.scss']
})
export class PromocodesComponent implements OnInit {
  dataSource: PromoCodesDataSource;
  displayedColumns = ["promoCodeNumber", "batchName", "brandName", "loyaltyPoints", "expirationDateTime", "isScanned", "scannedByUser"];
  selection = new SelectionModel<PromoCodes>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private promoCodesService: PromocodesService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.dataSource = new PromoCodesDataSource(this.promoCodesService);
    this.subscribeToLoader();
    this.dataSource.loadPromoCodes();
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(Constants.DebounceTime),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPromoCodesPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadPromoCodesPage())
      ).subscribe();

  }

  /**
   * Call on page change
   */
  paginate() {
    this.loadPromoCodesPage();
  }

  /**
   * Get list of all users
   */
  loadPromoCodesPage() {
    this.selection.clear();
    this.dataSource.loadPromoCodes(
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
