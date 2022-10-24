import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    authService = TestBed.get(AuthService);
    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('signup', () => {
    it('should return a token with valid username and password', () => {
      const user = { 'username': 'test', 'password': 'password' };
      const signupResponse = {
        "dietPreferences": [],
        "_id": "635478cda1dfce0c985ecda6",
        "username": "test",
        "password": "$2a$10$mQTohHcEXCLJIi4z15AlPeYJjjghu3Qii..7aLdW0G0rDZtlDnR72",
        "__v": 0
      }
      const loginResponse = {
        "token": "NgalrToken"
      }
      let response;
      authService.signup(user).subscribe(res => {
        response = res;
      })
      const loignSpy= spyOn(authService,'login').and.callFake(()=>of(loginResponse));
      http.expectOne(authService.signupAPI).flush(signupResponse);
      expect(response).toEqual(loginResponse);
      expect(loignSpy).toHaveBeenCalledWith(user);
      http.verify();
    })
    it('should return an error in case of invalid user object', () => {
      const user = { 'username': 'test', 'password': 'pswd' };
      const signupResponse = 'Your password must be at least 5 characters long.';
      let errorResponse;
      authService.signup(user).subscribe(res => { }, err => {
        errorResponse = err;
      },
      )
      http.expectOne(authService.signupAPI).flush({ message: signupResponse }, { status: 400, statusText: 'Bad Request' });
      expect(errorResponse.error.message).toEqual(signupResponse);
      http.verify();
    })
  })
  describe('login', () => {
    it('should return a token when succful login', () => {
      const user = { 'username': 'test', 'password': 'password' };
      const loginResponse = {
        "token": "NgalrToken"
      }
      let response;
      authService.login(user).subscribe(res=>{
        response=res;
      });
      http.expectOne(authService.loginAPI).flush(loginResponse);
      expect(response).toEqual(loginResponse);
      expect(localStorage.getItem('token')).toEqual(loginResponse.token);
      http.verify();
    })
  })
  // describe('logout', () => {
  //   it('should clear user data from storage', () => {
  //     authService.logout();
  //     expect(localStorage.getItem('token')).toEqual(null);
  //   })
  // })
});
