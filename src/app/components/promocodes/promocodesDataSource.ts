import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { finalize } from 'rxjs/internal/operators/finalize';
import { PromoCodes } from 'src/app/models/promocodes';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';

export class PromoCodesDataSource implements DataSource<PromoCodes> {

    private promoCodesSubject = new BehaviorSubject<PromoCodes[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private filteredCountSubject = new BehaviorSubject<number>(null);

    public loading$ = this.loadingSubject.asObservable();
    public page$ = this.filteredCountSubject.asObservable();

    public data: PromoCodes[];

    constructor(private promocodesService: PromocodesService) { }

    connect(collectionViewer: CollectionViewer): Observable<PromoCodes[]> {
        return this.promoCodesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.promoCodesSubject.complete();
        this.loadingSubject.complete();
        this.filteredCountSubject.complete();
    }

    loadPromoCodes(filter = '', sortColumn = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {

        this.loadingSubject.next(true);

        this.promocodesService.findPromoCodes(filter, sortColumn, sortDirection, pageIndex, pageSize)
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