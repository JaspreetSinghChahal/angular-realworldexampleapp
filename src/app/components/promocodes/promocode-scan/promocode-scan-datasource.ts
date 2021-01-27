import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { finalize } from 'rxjs/internal/operators/finalize';
import { PromoCodes } from 'src/app/models/promocodes';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { PromoCodesScanActivity } from 'src/app/models/promocodes-scan-activity';

export class PromoCodesScanDataSource implements DataSource<PromoCodesScanActivity> {

    private promoCodesSubject = new BehaviorSubject<PromoCodesScanActivity[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private filteredCountSubject = new BehaviorSubject<number>(null);

    public loading$ = this.loadingSubject.asObservable();
    public page$ = this.filteredCountSubject.asObservable();

    constructor(private promocodesService: PromocodesService) { }

    connect(collectionViewer: CollectionViewer): Observable<PromoCodesScanActivity[]> {
        return this.promoCodesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.promoCodesSubject.complete();
        this.loadingSubject.complete();
        this.filteredCountSubject.complete();
    }

    loadPromoCodesScanActivity(promocodeNumber, filter = '', sortColumn = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {

        this.loadingSubject.next(true);

        this.promocodesService.findPromoCodesScanActivity(promocodeNumber, filter, sortColumn, sortDirection, pageIndex, pageSize)
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