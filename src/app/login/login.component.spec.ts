import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { mockAuth } from '../services/auth/auth.service.spec';

import { LoginComponent } from './login.component';
let db: DebugElement;

class LoginPage {
  userInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  loginBtn: DebugElement;
  addPageElemnts() {
    this.userInput = db.query(By.css('#username')).nativeElement;
    this.passwordInput = db.query(By.css('#password')).nativeElement;
    this.loginBtn = db.query(By.css('[type=submit]'));
  }
}
class mockRouter {
  navigate(path) { }
}
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServ: AuthService;
  let router: Router;
  let loginPage: LoginPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useClass: mockAuth },
        { provide: Router, useClass: mockRouter },
      ],
      imports: [FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    db = fixture.debugElement;
    loginPage = new LoginPage();
    authServ = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      loginPage.addPageElemnts();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('login', () => {
    it('should navigate to dashboard if valid credentials', () => {
      loginPage.userInput.value = 'username';
      loginPage.passwordInput.value = 'password';
      loginPage.passwordInput.dispatchEvent(new Event('input'));
      loginPage.passwordInput.dispatchEvent(new Event('input'));
      spyOn(authServ, 'login').and.callFake(() => {
        return of({ token: 'token' })
      });
      spyOn(router, 'navigate').and.stub();
      loginPage.loginBtn.nativeElement.click();
      expect(authServ.login).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);

    });
    it('should result in error if password is incorrect', () => {
      loginPage.userInput.value = 'username';
      loginPage.passwordInput.value = 'password';
      loginPage.passwordInput.dispatchEvent(new Event('input'));
      loginPage.passwordInput.dispatchEvent(new Event('input'));
      spyOn(authServ, 'login').and.callFake(() => {
        return throwError({ error: { message: 'Incorrect password.' } });
      });
      loginPage.loginBtn.nativeElement.click();
      fixture.detectChanges();

      const alertMessage = db.query(By.css('.error'));
      expect(alertMessage.nativeElement.textContent).toEqual('Incorrect password.');
      expect(authServ.login).toHaveBeenCalled();
    });
    it('should result in error if user is incorrect', () => {
      loginPage.userInput.value = 'username';
      loginPage.passwordInput.value = 'password';
      loginPage.passwordInput.dispatchEvent(new Event('input'));
      loginPage.passwordInput.dispatchEvent(new Event('input'));
      spyOn(authServ, 'login').and.callFake(() => {
        return throwError({ error: { message: 'User could not be found.' } });
      });
      spyOn(router, 'navigate').and.stub();

      loginPage.loginBtn.nativeElement.click();
      fixture.detectChanges();

      const alertMessage = db.query(By.css('.error'));
      expect(alertMessage.nativeElement.textContent).toEqual('User could not be found.');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
