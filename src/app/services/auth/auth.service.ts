import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginResponse, signupResponse, User } from './user';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {  mergeMap, switchMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signupAPI = environment.API_URL + '/users'
  loginAPI = environment.API_URL + '/sessions';
  constructor(private httpClient: HttpClient,private jwtHelper:JwtHelperService) { }
  signup(user: User): Observable<loginResponse> {
    return this.httpClient.post<loginResponse>(this.signupAPI, user).pipe(switchMap(res=> this.login(user)));
  }
  login(user: User): Observable<loginResponse> {
    return this.httpClient.post<loginResponse>(this.loginAPI, user).pipe(
      tap(res=> localStorage.setItem('token',res.token))
    );
  }
  isLoggedIn(){
    return !this.jwtHelper.isTokenExpired();
  }
  logout(){
    localStorage.clear();
  }
}
