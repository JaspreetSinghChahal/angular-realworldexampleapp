import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UserPointResetDataSource } from './user-point-reset-dataSource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from 'src/app/services/user/user.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Constants } from 'src/app/shared/interceptors/constants';

@Component({
  selector: 'app-user-point-reset',
  templateUrl: './user-point-reset.component.html',
  styleUrls: ['./user-point-reset.component.scss', '../../../shared/scss/style.scss']
})
export class UserPointResetComponent implements OnInit {

  @Input()
  userId: string;

  @Input()
  refresh: boolean;

  dataSource: UserPointResetDataSource;
  displayedColumns = ["resetDateTime", "resetPoints"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private userlistService: UserService,
    private progressService: ProgressService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.dataSource = new UserPointResetDataSource(this.userlistService);
    this.subscribeToLoader();
    this.dataSource.loadUserResetActivity(this.userId);
  }

  ngOnChanges() {
    if (this.refresh == true) {
      this.loadPointResetActivityDataSource(this.userId);
    }
  }

  ngAfterViewInit() {

    /**
     * Triggered on input search
     */
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(Constants.DebounceTime),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPointResetActivityDataSource(this.userId);
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadPointResetActivityDataSource(this.userId))
      )
      .subscribe();
  }


  /**
       * Server side search.
       * Trigger on pagination change
       */
  paginate() {
    this.loadPointResetActivityDataSource(this.userId);
  }

  /**
   * Get All user activies
   * @param userId 
   */
  loadPointResetActivityDataSource(userId) {
    this.dataSource.loadUserResetActivity(
      userId,
      this.input.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  /**
   * Subscribe to loader in datasource
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
