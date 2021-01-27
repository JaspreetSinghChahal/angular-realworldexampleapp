import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { MatDialog } from '@angular/material/dialog';
import { PromoCodeBatchDetails } from 'src/app/models/promocode-batch-details';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { PromoCodesBatchDataSource } from './batch-promocodes-data-source';
import { AlertService } from 'src/app/services/alert.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Constants } from 'src/app/shared/interceptors/constants';

@Component({
  selector: 'app-batch-promocodes',
  templateUrl: './batch-promocodes.component.html',
  styleUrls: ['./batch-promocodes.component.scss', '../../shared/scss/style.scss']
})
export class BatchPromocodesComponent implements OnInit {
  dataSource: PromoCodesBatchDataSource;
  displayedColumns = ["select", "batchName", "brandName", "loyaltyPoints", "expirationDateTime", "noOfPromoCodes", "noOfPromoCodesScannedSuccessfully"];
  selection = new SelectionModel<PromoCodeBatchDetails>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private promoCodesService: PromocodesService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private alertService: AlertService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.dataSource = new PromoCodesBatchDataSource(this.promoCodesService);
    this.subscribeToLoader();
    this.dataSource.loadPromoCodesBatch();
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(Constants.DebounceTime),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPromoCodesBatch();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadPromoCodesBatch())
      ).subscribe();

  }

  /**
   * Call on page change
   */
  paginate() {
    this.loadPromoCodesBatch();
  }

  /**
   * Get list of all users
   */
  loadPromoCodesBatch() {
    this.selection.clear();
    this.dataSource.loadPromoCodesBatch(
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

  /**
  * Delete selected promocodes
  */
  deleteData() {
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm("Are you sure to expire items ")) {
        this.promoCodesService.deletePromoCodesBatch(numSelected.map(x => x.batchId)).subscribe(result => {
          this.showSuccessMessage("Records expired Successfully");
        },
          error => {
            this.utilityService.showErrorMessage(error);
          })
      }
    } else {
      alert("Select at least one row");
    }
  }

  /**
  * Check if all rows in a page index are selected
  */
  isEntirePageSelected() {
    const numSelected = this.selection.selected.length;
    const page = Math.min(this.paginator.length, this.paginator.pageSize);
    return numSelected === page;
  }

  /*
   * Selects all rows if they are not all selected; otherwise clear selection. 
   */
  masterToggle() {
    this.isEntirePageSelected() ?
      this.selection.clear() : this.selectRows();
  }

  /**
   * Select all rows in a page
   */
  selectRows() {
    let size = Math.min(this.paginator.length, this.paginator.pageSize);
    for (let index = 0; index < size; index++) {
      this.selection.select(this.dataSource.data[index]);
    }
  }

  /**
     * Show success message
     */
  private showSuccessMessage(msg: string) {
    const dialogRef = this.alertService.openSuccessModal(msg);
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loadPromoCodesBatch();
    });
  }
}
