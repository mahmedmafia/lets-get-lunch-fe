import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../services/auth/user';

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
  dietPreferences = [
    { name: 'BBQ', checked: false },
    { name: 'Burger', checked: false },
    { name: 'Chinese', checked: false },
    { name: 'Deli', checked: false },
    { name: 'Fast Food', checked: false },
    { name: 'Italian', checked: false },
    { name: 'Japanese', checked: false },
    { name: 'Mexican', checked: false },
    { name: 'Pizza', checked: false }
  ];
  errorMessage:string;
  constructor(private authServ: AuthService) { }

  ngOnInit(): void {
  }
  signup(formValue: User) {
    formValue.dietPreferences=this.getSelectedPrefereces();
    this.authServ.signup(formValue).subscribe(res => {
      console.log('res', res);
    },err=> this.errorMessage=err.error.message)
  }
  onPrefCheck(index:number){
    this.dietPreferences[index].checked=!this.dietPreferences[index].checked;
  }
  getSelectedPrefereces(){
    return this.dietPreferences.filter(df=> df.checked==true).map(df=> df.name);
  }

}
