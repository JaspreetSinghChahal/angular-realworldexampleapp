import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';
import { UserScanActivity } from 'src/app/models/user-scan-activity';
import { CollectionViewer } from '@angular/cdk/collections';
import { UserService } from 'src/app/services/user/user.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { finalize } from 'rxjs/internal/operators/finalize';

export class UserScanActivityDataSource implements DataSource<UserScanActivity> {

    private userActivitySubject = new BehaviorSubject<UserScanActivity[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private filteredCountSubject = new BehaviorSubject<number>(null);

    public loading$ = this.loadingSubject.asObservable();
    public page$ = this.filteredCountSubject.asObservable();

    constructor(private userlistService: UserService) { }

    connect(collectionViewer: CollectionViewer): Observable<UserScanActivity[]> {
        return this.userActivitySubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.userActivitySubject.complete();
        this.loadingSubject.complete();
        this.filteredCountSubject.complete();
    }

    loadUserActivity(userId, filter = '', sortColumn = '',
        sortDirection = 'asc', pageIndex = 0, pageSize = 10) {

        this.loadingSubject.next(true);

        this.userlistService.userScanActivity(userId, filter, sortColumn, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(userActivity => {
                this.userActivitySubject.next(userActivity)
                if (userActivity.length > 0) {
                    this.filteredCountSubject.next(userActivity[0].filteredCount);
                }
                else {
                    this.filteredCountSubject.next(0);
                }
            });
    }
}