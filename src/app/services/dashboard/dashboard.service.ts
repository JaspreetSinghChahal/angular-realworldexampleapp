import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStatistics } from 'src/app/models/userStatistics';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BrandReputation } from 'src/app/models/brand-reputation';
import { PromotionMessage } from 'src/app/models/promotion-message';
import { Brand } from 'src/app/models/brand';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  public userStatistics(): Observable<UserStatistics> {

    return this.http.get<UserStatistics>(environment.apiEndpoint + '/dashboard/GetUserStatistics');
  }

  public reputationPerBrand(filter = '', sortColumn: string,
    sortOrder = 'asc', pageNumber = 0, pageSize = 3): Observable<BrandReputation[]> {

    return this.http.post<BrandReputation[]>(environment.apiEndpoint + '/Dashboard/GetReputationPerBrand', {
      Filter: filter,
      SortColumn: sortColumn,
      SortOrder: sortOrder,
      PageNumber: pageNumber,
      PageSize: pageSize
    });
  }

  public promotionMessage(): Observable<PromotionMessage> {
    return this.http.get<PromotionMessage>(environment.apiEndpoint + '/dashboard/GetPromotionMessge');
  }

  public savePromotionMessage(promotionMessage: string, fileName: string): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/dashboard/PromotionMessge', {
      PromotionFileName: fileName,
      PromotionText: promotionMessage
    }, { responseType: 'text' });
  }

  public loadBrands(filter = '', sortColumn: string, sortOrder = 'asc', pageNumber = 0, pageSize = 3): Observable<Brand[]> {

    return this.http.post<Brand[]>(environment.apiEndpoint + '/Brand/GetBrands', {
      Filter: filter,
      SortColumn: sortColumn,
      SortOrder: sortOrder,
      PageNumber: pageNumber,
      PageSize: pageSize
    });
  }

  public addBrand(brand: Brand): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/Brand/AddBrand',
      {
        BrandName: brand.brandName
      },
      { responseType: 'text' });
  }


}
