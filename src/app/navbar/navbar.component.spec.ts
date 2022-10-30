import { DebugElement, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

import { NavbarComponent } from './navbar.component';
class mockAuth {
  isLoggedIn() { }
  loggedIn = of();
  logout() { }
}
class mockRouter {
  navigate(path) { }
}
fdescribe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: AuthService;
  let db: DebugElement;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [{ provide: AuthService, useClass: mockAuth }, { provide: Router, useClass: mockRouter }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
    db = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('user is LoggedIn', () => {
    beforeEach(() => {
      spyOn(authService,'isLoggedIn').and.returnValue(true);
      fixture.detectChanges();
    })
    it('should intialize to see if user is logged in',()=>{
      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(true);
    })
    it('should have link to dashboard if loggedIn',()=>{
      const link=db.query(By.css('.navbar-brand'));
      expect(link.attributes.routerLink).toEqual('/dashboard');
    })
    it('should have link of logout',()=>{
      const link=db.query(By.css("[data-test=logout]"));
      expect(link).toBeTruthy();
      expect(link.nativeElement.innerText).toEqual('Logout');
    })
    it('should navigate to logout when clicked on',()=>{
      const link=db.query(By.css("[data-test=logout]"));
      spyOn(router,'navigate').and.stub();
      spyOn(authService,'logout').and.stub();
      component.logOut();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    })
  });
  describe('user is not LoggedIn', () => {
    beforeEach(() => {
      authService.isLoggedIn=jasmine.createSpy('isLoggedIn').and.returnValue(false);
      fixture.detectChanges();
    })
    it('should intialize to see if user is logged in',()=>{
      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(false);
    })
    it('should have link to homepage',()=>{
      const link=db.query(By.css('.navbar-brand'));
      expect(link.attributes.routerLink).toEqual('');
    })
    it('should have link of signup',()=>{
      const link=db.query(By.css("[data-test=signup]"));
      expect(link).toBeTruthy();
      expect(link.attributes.routerLink).toEqual('/signup');
    })

  })
});
