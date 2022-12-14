import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtModule } from '@auth0/angular-jwt';
export class mockAuth {
  isLoggedIn() { }
  loggedIn = of();
  logout() { }
  login(user) { }
}
const tokenGetter = () => {
  return localStorage.getItem('token');
}
describe('AuthService', () => {
  let authService: AuthService;
  let http: HttpTestingController;
  let jwtHelper: JwtHelperService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, JwtModule.forRoot({ config: { tokenGetter: tokenGetter } })],
      providers: [AuthService, JwtHelperService]
    });
    authService = TestBed.get(AuthService);
    http = TestBed.get(HttpTestingController);
    jwtHelper = TestBed.get(JwtHelperService);

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
      const loignSpy = spyOn(authService, 'login').and.callFake(() => of(loginResponse));
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
      authService.login(user).subscribe(res => {
        response = res;
      });
      spyOn(authService.loggedIn, 'emit')
      http.expectOne(authService.loginAPI).flush(loginResponse);
      expect(response).toEqual(loginResponse);
      expect(localStorage.getItem('token')).toEqual(loginResponse.token);
      expect(authService.loggedIn.emit).toHaveBeenCalled();
      http.verify();
    })
  })
  describe('isLoggedIn', () => {
    it('should return true if the user is logged in', () => {
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.' +
        'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ');
      expect(authService.isLoggedIn()).toEqual(true);
    });
    it('should return false if the user is notlogged in', () => {
      localStorage.removeItem('token');
      expect(authService.isLoggedIn()).toEqual(false);
    });
  });
  describe('logout', () => {
    it('should clear user data from storage', () => {
      spyOn(authService.loggedIn, 'emit').and.stub();
      authService.logout();
      expect(authService.isLoggedIn()).toEqual(false);
      expect(authService.loggedIn.emit).toHaveBeenCalledWith(false);
    })
  })
  describe('current user', () => {
    it('should return user object when decoding token', () => {
      spyOn(localStorage, 'getItem').and.returnValue('s3rT0ken');
      spyOn(jwtHelper, 'decodeToken').and.callFake(() => {
        return {
          exp: 1511512,
          iat: 1512241,
          username: 'username',
          _id: '51aasdasdkak'
        }
      });
      const res = authService.currentUser();
      expect(res.username).toBeDefined();
      expect(res._id).toBeDefined();
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(jwtHelper.decodeToken).toHaveBeenCalled();

    })
  })
});
