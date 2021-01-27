import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { finalize } from 'rxjs/internal/operators/finalize';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { BatchPromoCodeScanActivity } from 'src/app/models/batch-promocodes-scan-activity';

export class PromoCodesBatchScanDataSource implements DataSource<BatchPromoCodeScanActivity> {

    private promoCodesSubject = new BehaviorSubject<BatchPromoCodeScanActivity[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private filteredCountSubject = new BehaviorSubject<number>(null);

    public loading$ = this.loadingSubject.asObservable();
    public page$ = this.filteredCountSubject.asObservable();

    constructor(private promocodesService: PromocodesService) { }

    connect(collectionViewer: CollectionViewer): Observable<BatchPromoCodeScanActivity[]> {
        return this.promoCodesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.promoCodesSubject.complete();
        this.loadingSubject.complete();
        this.filteredCountSubject.complete();
    }

    loadPromoCodesBatchScanActivity(batchId, filter = '', sortColumn = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {

        this.loadingSubject.next(true);

        this.promocodesService.findPromoCodesBatchScanActivity(batchId, filter, sortColumn, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(users => {
                this.promoCodesSubject.next(users);
                if (users.length > 0) {
                    this.filteredCountSubject.next(users[0].filteredCount);
                }
                else {
                    this.filteredCountSubject.next(0);
                }
            });
    }
}