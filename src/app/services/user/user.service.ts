import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from 'src/app/models/users';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BrandReputation } from 'src/app/models/brand-reputation';
import { UserScanActivity } from 'src/app/models/user-scan-activity';
import { environment } from '../../../environments/environment';
import { Roles } from 'src/app/models/roles';
import { ResetPointsDetails } from 'src/app/models/reset-points-details';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * Get  paginated user list with search and sort feature
   * @param sortColumn
   * @param filter 
   * @param sortOrder 
   * @param pageNumber 
   * @param pageSize 
   */
  public findUsers(
    filter = '', sortColumn: string, sortOrder = 'asc',
    pageNumber = 0, pageSize = 3): Observable<Users[]> {

    return this.http.post<Users[]>(environment.apiEndpoint + '/User/GetUsers', {
      filter, sortColumn, sortOrder, pageNumber, pageSize
    });
  }


  /**
   * Get details per user
   */
  public userInfo(userId: string) {
    return this.http.get<Users>(environment.apiEndpoint + '/User/GetUserInfo/' + userId);
  }

  /**
   * User reputation per brand
   * @param userId 
   */
  public userReputationPerBrand(userId: string, filter = '', sortColumn: string,
    sortOrder = 'asc', pageNumber = 0, pageSize = 3): Observable<BrandReputation[]> {

    return this.http.post<BrandReputation[]>(environment.apiEndpoint + '/User/GetUsersReputationPerBrand', {
      Id: userId,
      Filter: filter,
      SortColumn: sortColumn,
      SortOrder: sortOrder,
      PageNumber: pageNumber,
      PageSize: pageSize
    });
  }

  /**
   * User scan records
   * @param userId 
   * @param sortColumn 
   * @param filter 
   * @param sortOrder 
   * @param pageNumber 
   * @param pageSize 
   */
  public userScanActivity(
    userId: string, filter = '', sortColumn: string, sortOrder = 'asc',
    pageNumber = 0, pageSize = 10): Observable<UserScanActivity[]> {

    return this.http.post<UserScanActivity[]>(environment.apiEndpoint + '/User/GetUserScanActivity', {
      Id: userId,
      Filter: filter,
      SortColumn: sortColumn,
      SortOrder: sortOrder,
      PageNumber: pageNumber,
      PageSize: pageSize
    });
  }

  public userPointResetActivity(
    userId: string, filter = '', sortColumn: string, sortOrder = 'asc',
    pageNumber = 0, pageSize = 10): Observable<ResetPointsDetails[]> {

    return this.http.post<ResetPointsDetails[]>(environment.apiEndpoint + '/User/UserResetPointData', {
      Id: userId,
      Filter: filter,
      SortColumn: sortColumn,
      SortOrder: sortOrder,
      PageNumber: pageNumber,
      PageSize: pageSize
    });
  }

  /**
   * Get list of all roles
   * @param userId
   */
  public allRoles() {
    return this.http.get<Roles[]>(environment.apiEndpoint + '/Accounts/AllRoles/');
  }


  /**
   * Update user details
   * @param user 
   */
  public updateUser(user: Users): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/User/UpdateUser', user, { responseType: 'text' });
  }


  public deleteUsers(userids: string[]): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/User/DeleteUsers/', { userIds: userids }, { responseType: 'text' });
  }

  public resetPoints(userid: string): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/User/UserResetPoints/', { UserId: userid }, { responseType: 'text' });
  }


  /**
   * Register new usr
   * @param user 
   */
  public addUser(user: Users): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/Accounts/Register', user, { responseType: 'text' });
  }

  public downloadUser(): Observable<Blob> {
    return this.http.get<Blob>(environment.apiEndpoint + '/Reports/GetUserReport', { responseType: 'blob' as 'json' });
  }

  public downloadUserReputation(): Observable<Blob> {
    return this.http.get<Blob>(environment.apiEndpoint + '/Reports/GetUserReputation', { responseType: 'blob' as 'json' });
  }
}