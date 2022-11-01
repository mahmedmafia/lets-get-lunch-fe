import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../services/auth/user';
import { DietaryPreferencesService } from '../services/dietary-preferences/dietary-preferences.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User = {
    username: '',
    password: ''
  }
  dietPreferences =[];
  errorMessage:string;
  constructor(private authServ: AuthService,private dietPrefServs:DietaryPreferencesService,private router:Router) {
    this.dietPreferences=dietPrefServs.getdietPreferences();
  }

  ngOnInit(): void {
  }
  signup(formValue: User) {
    formValue.dietPreferences=this.getSelectedPrefereces();
    this.authServ.signup(formValue).subscribe(res => {
      this.router.navigate(['/dashboard']);
    },err=> this.errorMessage=err.error.message)
  }
  onPrefCheck(index:number){
    this.dietPreferences[index].checked=!this.dietPreferences[index].checked;
  }
  getSelectedPrefereces(){
    return this.dietPreferences.filter(df=> df.checked==true).map(df=> df.name);
  }

}
