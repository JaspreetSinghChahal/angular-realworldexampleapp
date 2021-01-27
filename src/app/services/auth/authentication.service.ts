import { Injectable } from '@angular/core';
import * as moment from "moment";
import { HttpClient } from '@angular/common/http';
import { Token } from 'src/app/models/token';
import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ResetPassword } from 'src/app/models/reset-Password';
import { TermsAndConditions } from 'src/app/models/termsAndConditionsText';

@Injectable({
  providedIn: 'root'
})
/**
 * Handles login and token related functionality
 */
export class AuthenticationService {

  constructor(private http: HttpClient) {

  }

  /**
   * Login user and save token in local storage
   * @param username 
   * @param password 
   */
  login(username: string, password: string, isTermsAndConditonsAccepted: boolean): Observable<Token> {
    return this.http.post<Token>(environment.apiEndpoint + '/Auth/Login', { username, password, isTermsAndConditonsAccepted })
      .pipe(
        tap(res => this.setSession(res)),
        shareReplay()
      );
  }

  refreshToken(): Observable<Token> {
    let token = this.getJwtToken();
    let refreshToken = this.getRefreshToken();
    return this.http.post<Token>(environment.apiEndpoint + '/Auth/RefreshToken', { RefreshToken: refreshToken, AccessToken: token })
      .pipe(
        tap(res => this.setSession(res)));
  }


  forgotPasword(username): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/Accounts/ForgotPassword', { Email: username }, { responseType: 'text' })
  }


  resetPassword(resetPassword: ResetPassword): Observable<string> {
    return this.http.post(environment.apiEndpoint + '/Accounts/ResetPassword  ', {
      "UserId": resetPassword.userId,
      "Password": resetPassword.password,
      "Token": resetPassword.token
    }, { responseType: 'text' })
  }

  getTermsAndConditions(): Observable<TermsAndConditions> {
    return this.http.get<TermsAndConditions>(environment.apiEndpoint + '/Auth/TermsAndConditions')
  }

  updateTermsAndConditions(termsAndConditionsText): Observable<boolean> {
    return this.http.post<boolean>(environment.apiEndpoint + '/Auth/TermsAndConditions',
      {
        TermsAndConditionsText: termsAndConditionsText
      });
  }

  /**
   * Save token details in local storage
   */
  private setSession(authResult: Token) {
    const expiresAt = moment().add(authResult.validFor, 'second');
    localStorage.setItem('id_token', authResult.authToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("refresh_token", authResult.refreshToken);
  }

  public getJwtToken() {
    return localStorage.getItem("id_token");
  }

  private getRefreshToken() {
    return localStorage.getItem("refresh_token");
  }

  /**
   * Remove token when user logs out
   */
  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("refresh_token");
  }


  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  /**
   * Get time when token will expire
   */
  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}