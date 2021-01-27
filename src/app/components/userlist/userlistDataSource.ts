import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';
import { Users } from 'src/app/models/users';
import { CollectionViewer } from '@angular/cdk/collections';
import { UserService } from 'src/app/services/user/user.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { finalize } from 'rxjs/internal/operators/finalize';

export class UserlistDataSource implements DataSource<Users> {

    private userListSubject = new BehaviorSubject<Users[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private filteredCountSubject = new BehaviorSubject<number>(null);

    public loading$ = this.loadingSubject.asObservable();
    public page$ = this.filteredCountSubject.asObservable();

    public data: Users[];

    constructor(private userlistService: UserService) { }

    connect(collectionViewer: CollectionViewer): Observable<Users[]> {
        return this.userListSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.userListSubject.complete();
        this.loadingSubject.complete();
        this.filteredCountSubject.complete();
    }

    loadUsers(filter = '', sortColumn = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {

        this.loadingSubject.next(true);

        this.userlistService.findUsers(filter, sortColumn, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(users => {
                this.data = users;
                this.userListSubject.next(users);
                if (users.length > 0) {
                    this.filteredCountSubject.next(users[0].filteredCount);
                }
                else {
                    this.filteredCountSubject.next(0);
                }
            });
    }
}