import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

import { AuthGuard } from './auth.guard';
class mockAuthService {
  isLoggedIn() { }
}
class mockRouter{
  navigate(route){
    console.log('called');
  }
}
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authSev:AuthService;
  let router:Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useClass: mockAuthService },{ provide: Router, useClass: mockRouter }]
    });
    guard = TestBed.inject(AuthGuard);
    authSev=TestBed.get(AuthService);
    router=TestBed.get(Router);
  });
  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
  describe('Can Activate',()=>{
    it('should return true if user is loggedIn',()=>{
      spyOn(authSev,'isLoggedIn').and.returnValue(true);
      expect(guard.canActivate()).toEqual(true);
    })
    it('should  navigate away if user not loggedIn',()=>{
      spyOn(authSev,'isLoggedIn').and.returnValue(false);
      const routerSpy = spyOn(router, 'navigate');
      expect(guard.canActivate()).toEqual(false);
      expect(routerSpy).toHaveBeenCalledWith(['/']);
    })
  })

});
