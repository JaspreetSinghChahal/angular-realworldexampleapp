import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { finalize } from 'rxjs/internal/operators/finalize';
import { PromoCodes } from 'src/app/models/promocodes';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { PromoCodeBatchDetails } from 'src/app/models/promocode-batch-details';

export class PromoCodesBatchDataSource implements DataSource<PromoCodeBatchDetails> {

    private promoCodesSubject = new BehaviorSubject<PromoCodeBatchDetails[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private filteredCountSubject = new BehaviorSubject<number>(null);

    public loading$ = this.loadingSubject.asObservable();
    public page$ = this.filteredCountSubject.asObservable();

    public data: PromoCodeBatchDetails[];

    constructor(private promocodesService: PromocodesService) { }

    connect(collectionViewer: CollectionViewer): Observable<PromoCodeBatchDetails[]> {
        return this.promoCodesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.promoCodesSubject.complete();
        this.loadingSubject.complete();
        this.filteredCountSubject.complete();
    }

    loadPromoCodesBatch(filter = '', sortColumn = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {

        this.loadingSubject.next(true);

        this.promocodesService.findPromoCodesBatch(filter, sortColumn, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(users => {
                this.data = users;
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