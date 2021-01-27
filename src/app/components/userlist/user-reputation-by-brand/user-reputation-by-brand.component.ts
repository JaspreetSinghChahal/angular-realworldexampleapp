import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from 'src/app/services/user/user.service';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { UserReputationDataSource } from './user-reputation-datasource';
import { ProgressService } from '../../../services/spinner/progress.service';
import { Constants } from 'src/app/shared/interceptors/constants';

@Component({
  selector: 'app-user-reputation-by-brand',
  templateUrl: './user-reputation-by-brand.component.html',
  styleUrls: ['./user-reputation-by-brand.component.scss', '../../../shared/scss/style.scss']
})
export class UserReputationByBrandComponent implements OnInit {

  @Input()
  userId: string;

  @Input()
  refresh: boolean;

  dataSource: UserReputationDataSource;
  displayedColumns = ["brandName", "reputationPoint"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private userlistService: UserService,
    private progressService: ProgressService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.dataSource = new UserReputationDataSource(this.userlistService);
    this.subscribeToLoader();
    this.dataSource.loadUserReputations(this.userId);
  }

  ngOnChanges()
  {
    if(this.refresh==true)
    {
      this.loadUserReputationPage(this.userId);
    }
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
          this.loadUserReputationPage(this.userId);
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadUserReputationPage(this.userId))
      )
      .subscribe();
  }


  /**
     * Server side search.
     * Trigger on pagination change
     */
  paginate() {
    this.loadUserReputationPage(this.userId);
  }

  /**
   * Load user reputation points per brand
   * @param userId 
   */
  loadUserReputationPage(userId) {
    this.dataSource.loadUserReputations(
      userId,
      this.input.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }


  /**
   * Subscribe to loader in service
   * @param userId 
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
