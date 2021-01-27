import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from 'src/app/services/user/user.service';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { UserScanActivityDataSource } from './user-scan-activity-datasource';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { Constants } from 'src/app/shared/interceptors/constants';

@Component({
  selector: 'app-user-scan-activity',
  templateUrl: './user-scan-activity.component.html',
  styleUrls: ['./user-scan-activity.component.scss', '../../../shared/scss/style.scss']
})
export class UserScanActivityComponent implements OnInit {

  @Input()
  userId: string;

  dataSource: UserScanActivityDataSource;
  displayedColumns = ["promoCodeNumber", "brandName", "loyaltyPoints", "scannedDateTime", "isSuccess"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private userlistService: UserService,
    private progressService: ProgressService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.dataSource = new UserScanActivityDataSource(this.userlistService);
    this.subscribeToLoader();
    this.dataSource.loadUserActivity(this.userId);
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
          this.loadUserScanActivityDataSource(this.userId);
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadUserScanActivityDataSource(this.userId))
      )
      .subscribe();
  }


  /**
       * Server side search.
       * Trigger on pagination change
       */
  paginate() {
    this.loadUserScanActivityDataSource(this.userId);
  }

  /**
   * Get All user activies
   * @param userId 
   */
  loadUserScanActivityDataSource(userId) {
    this.dataSource.loadUserActivity(
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
