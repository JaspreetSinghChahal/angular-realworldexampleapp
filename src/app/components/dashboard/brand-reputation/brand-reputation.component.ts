import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ReputationDataSource } from './reputation-datasource';
import { Constants } from 'src/app/shared/interceptors/constants';

@Component({
  selector: 'app-brand-reputation',
  templateUrl: './brand-reputation.component.html',
  styleUrls: ['./brand-reputation.component.scss', '../../../shared/scss/style.scss']
})
export class BrandReputationComponent implements OnInit {

  dataSource: ReputationDataSource;
  displayedColumns = ["brandName", "reputationPoint"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private dashboardService: DashboardService,
    private progressService: ProgressService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.dataSource = new ReputationDataSource(this.dashboardService);
    this.subscribeToLoader();
    this.dataSource.loadReputations();
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
          this.loadReputationPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadReputationPage())
      )
      .subscribe();
  }


  /**
     * Server side search.
     * Trigger on pagination change
     */
  paginate() {
    this.loadReputationPage();
  }

  /**
   * Load  reputation points per brand
   */
  loadReputationPage() {
    this.dataSource.loadReputations(
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
}
