import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PromoCodes } from 'src/app/models/promocodes';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { PromoCodesScanActivity } from 'src/app/models/promocodes-scan-activity';
import { PromoCodeBatchDetails } from 'src/app/models/promocode-batch-details';
import { BatchPromoCodeScanActivity } from 'src/app/models/batch-promocodes-scan-activity';

@Injectable({
  providedIn: 'root'
})
export class PromocodesService {

  constructor(private http: HttpClient) { }

  /**
   * Get  paginated promocode list with search and sort feature
   * @param sortColumn
   * @param filter 
   * @param sortOrder 
   * @param pageNumber 
   * @param pageSize 
   */
  public findPromoCodes(
    filter = '', sortColumn: string, sortOrder = 'asc',
    pageNumber = 0, pageSize = 10): Observable<PromoCodes[]> {

    return this.http.post<PromoCodes[]>(environment.apiEndpoint + '/PromoCodes/GetPromoCodes', {
      filter, sortColumn, sortOrder, pageNumber, pageSize
    });
  }

  /**
   * Get details of promocode
   */
  public promoccodeInfo(promocodeNumber: number) {
    return this.http.get<PromoCodes>(environment.apiEndpoint + '/PromoCodes/GetPromoCodeInfo/' + promocodeNumber);
  }

  public findPromoCodesScanActivity(promocodeNumber: number, filter = '', sortColumn: string, sortOrder = 'asc',
    pageNumber = 0, pageSize = 10) {
    return this.http.post<PromoCodesScanActivity[]>(environment.apiEndpoint + '/PromoCodes/GetPromoCodeScanActivity',
      {
        promocodeNumber, filter, sortColumn, sortOrder, pageNumber, pageSize
      });
  }

  public deletePromoCodes(promocodeNumbers: number[]): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/PromoCodes/DeletePromoCodes/', { promocodeNumbers }, { responseType: 'text' });
  }


  /**
   * Get  paginated promocode list with search and sort feature
   * @param sortColumn
   * @param filter 
   * @param sortOrder 
   * @param pageNumber 
   * @param pageSize 
   */
  public findPromoCodesBatch(
    filter = '', sortColumn: string, sortOrder = 'asc',
    pageNumber = 0, pageSize = 10): Observable<PromoCodeBatchDetails[]> {

    return this.http.post<PromoCodeBatchDetails[]>(environment.apiEndpoint + '/PromoCodes/GetBatchPromoCodes', {
      filter, sortColumn, sortOrder, pageNumber, pageSize
    });
  }

  public promoccodeBatchInfo(batchId: string) {
    return this.http.get<PromoCodeBatchDetails>(environment.apiEndpoint + '/PromoCodes/GetPromoCodeBatchInfo/' + batchId);
  }

  public findPromoCodesBatchScanActivity(batchId: string, filter = '', sortColumn: string, sortOrder = 'asc',
    pageNumber = 0, pageSize = 10) {
    return this.http.post<BatchPromoCodeScanActivity[]>(environment.apiEndpoint + '/PromoCodes/GetPromoCodeBatchScanActivity',
      {
        batchId, filter, sortColumn, sortOrder, pageNumber, pageSize
      });
  }

  public deletePromoCodesBatch(batchId: string[]): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/PromoCodes/DeletePromoCodeBatch/', { PromocodeBatchId: batchId }, { responseType: 'text' });
  }

  public createPromocode(promocode: PromoCodeBatchDetails): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/PromoCodes/AddPromoCode',
      {
        BatchName: promocode.batchName,
        BrandId: promocode.brandId,
        LoyaltyPoints: promocode.loyaltyPoints,
        NoOfPromoCodes: parseInt(promocode.noOfPromoCodes.toString()),
        expirationDateTime: promocode.expirationDateTime
      },
      { responseType: 'text' });
  }

  public downloadQRCode(batchId: string, height: number, width: number, color: string): Observable<Blob> {
    return this.http.post<Blob>(environment.apiEndpoint + '/PromoCodes/DownloadQRCode',
      {
        BatchId: batchId,
        Height: height,
        Width: width,
        Color: color,
        FileType: 'png'
      },
      { responseType: 'blob' as 'json' });
  }

  public downloadPromocodes(): Observable<Blob> {
    return this.http.get<Blob>(environment.apiEndpoint + '/Reports/GetPromocodes', { responseType: 'blob' as 'json' });
  }
}
