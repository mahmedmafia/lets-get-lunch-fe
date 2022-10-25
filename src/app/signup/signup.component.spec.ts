import { DebugElement } from '@angular/core';
import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../services/auth/user';
import { DietaryPreferencesService } from '../services/dietary-preferences/dietary-preferences.service';
import { SignupComponent } from './signup.component';

class SignupPage {
  submitBtn: DebugElement;
  passwordInput: HTMLInputElement;
  userInput: HTMLInputElement;
  dietPreferences: DebugElement[];
  addPageElemnets() {
    this.submitBtn = fixture.debugElement.query(By.css('button'));
    this.userInput = fixture.debugElement.query(By.css('[name=username]')).nativeElement;
    this.passwordInput = fixture.debugElement.query(By.css('[name=password]')).nativeElement;
    this.dietPreferences = fixture.debugElement.queryAll(By.css('[name=preference]'));
  }

}
class MockAuthService {
  signup(credentials) { }
}
class MockRouterService {
  navigate(route) { }
}
let component: SignupComponent;
let fixture: ComponentFixture<SignupComponent>;
let signupPage: SignupPage;
let authService: AuthService;
let router: Router;
describe('SignupComponent', () => {


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [FormsModule]
    }).overrideComponent(SignupComponent, {
      set: {
        providers: [
          DietaryPreferencesService,
          { provide: AuthService, useClass: MockAuthService },
          { provide: Router, useClass: MockRouterService },

        ]
      }
    })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    signupPage = new SignupPage();
    authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      signupPage.addPageElemnets();
    })
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create user with valid credentials', () => {
    signupPage.userInput.value = 'test';
    signupPage.passwordInput.value = 'password2';

    signupPage.dietPreferences[0].nativeElement.click();
    signupPage.dietPreferences[1].nativeElement.click();
    signupPage.userInput.dispatchEvent(new Event('input'));
    signupPage.passwordInput.dispatchEvent(new Event('input'));
    const signupSpy = spyOn(authService, 'signup').and.callFake(() => {
      return of({ token: 'token3Has5hed' })
    })
    const routerSpy = spyOn(router, 'navigate').and.stub();
    signupPage.submitBtn.nativeElement.click();
    const expectedUser: User = {
      username: 'test',
      password: 'password2',
      dietPreferences: [component.dietPreferences[0].name, component.dietPreferences[1].name]
    }
    expect(signupSpy).toHaveBeenCalledWith(expectedUser);
    expect(component.dietPreferences[0].checked).toEqual(true);
    expect(component.dietPreferences[1].checked).toEqual(true);
    expect(routerSpy).toHaveBeenCalledWith(['/dashboard']);
  })
  it('should display an error message with invalid credentials', () => {
    signupPage.userInput.value = 'janedoe';
    signupPage.passwordInput.value = 'pswd';
    signupPage.userInput.dispatchEvent(new Event('input'));
    signupPage.passwordInput.dispatchEvent(new Event('input'));

    spyOn(authService, 'signup').and.callFake(() => {
      return throwError({
        error: {
          message: 'Your password must be at least 5 characters long.'
        }
      });
    });
    signupPage.submitBtn.nativeElement.click();

    fixture.detectChanges();
    const errorMessage: DebugElement = fixture.debugElement.query(By.css('.alert'));
    expect(errorMessage.nativeElement.textContent)
      .toEqual('Your password must be at least 5 characters long.');
  });
});

