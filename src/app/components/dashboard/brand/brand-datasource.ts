import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';
import { BrandReputation } from 'src/app/models/brand-reputation';
import { CollectionViewer } from '@angular/cdk/collections';
import { UserService } from 'src/app/services/user/user.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { finalize } from 'rxjs/internal/operators/finalize';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Brand } from 'src/app/models/brand';

export class BrandDataSource implements DataSource<Brand> {

    private brandSubject = new BehaviorSubject<Brand[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private filteredCountSubject = new BehaviorSubject<number>(null);

    public loading$ = this.loadingSubject.asObservable();
    public page$ = this.filteredCountSubject.asObservable();

    constructor(private dashboardService: DashboardService) { }

    connect(collectionViewer: CollectionViewer): Observable<Brand[]> {
        return this.brandSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.brandSubject.complete();
        this.loadingSubject.complete();
        this.filteredCountSubject.complete();
    }

    loadBrands(filter = '', sortColumn = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {

        this.loadingSubject.next(true);

        this.dashboardService.loadBrands(filter, sortColumn, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(brands => {
                this.brandSubject.next(brands)
                if (brands.length > 0) {
                    this.filteredCountSubject.next(brands[0].filteredCount);
                }
                else {
                    this.filteredCountSubject.next(0);
                }
            });
    }
}