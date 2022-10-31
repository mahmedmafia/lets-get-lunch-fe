import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginResponse, signupResponse, User } from './user';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import {  mergeMap, switchMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  signupAPI = environment.API_URL + '/users'
  @Output() loggedIn:EventEmitter<boolean>
  loginAPI = environment.API_URL + '/sessions';
  constructor(private httpClient: HttpClient,private jwtHelper:JwtHelperService) {
    this.loggedIn=new EventEmitter();
   }
  signup(user: User): Observable<loginResponse> {
    return this.httpClient.post<loginResponse>(this.signupAPI, user).pipe(switchMap(res=> this.login(user)));
  }
  login(user: User): Observable<loginResponse> {
    return this.httpClient.post<loginResponse>(this.loginAPI, user).pipe(
      tap(res=> {
        this.loggedIn.emit(true);
        localStorage.setItem('token',res.token)
      })
    );
  }
  isLoggedIn(){
    return !this.jwtHelper.isTokenExpired();
  }
  logout(){
    localStorage.clear();
    this.loggedIn.emit(false);
  }
}
