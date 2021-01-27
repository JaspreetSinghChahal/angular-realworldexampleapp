import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BrandDataSource } from './brand-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { Constants } from 'src/app/shared/interceptors/constants';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss', '../../../shared/scss/style.scss']
})
export class BrandComponent implements OnInit {

  dataSource: BrandDataSource;
  displayedColumns = ["brandName"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(
    private dialog: MatDialog,
    private dashboardService: DashboardService,
    private progressService: ProgressService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.dataSource = new BrandDataSource(this.dashboardService);
    this.subscribeToLoader();
    this.dataSource.loadBrands();
  }

  ngAfterViewInit() {

    /**
     * Server side search.
     * Trigger on key up in search input
     */
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(Constants.DebounceTime),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadBrands();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadBrands())
      )
      .subscribe();
  }


  /**
     * Server side search.
     * Trigger on pagination change
     */
  paginate() {
    this.loadBrands();
  }

  /**
   * Load  reputation points per brand
   */
  loadBrands() {
    this.dataSource.loadBrands(
      this.input.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }


  /**
   * Subscribe to loader in service
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
   * Open dialog box to add new brand
   * Pass dialog configuration and refresh table after dialog close
   */
  addBrand() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(AddBrandComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => this.loadBrands()
    );
  }
}
