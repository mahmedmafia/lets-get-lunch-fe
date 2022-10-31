import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../services/auth/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user:User={
    username:'',
    password:'',
  }
  errMessage:string='';
  constructor(private authServ:AuthService,private router:Router) { }

  ngOnInit(): void {
  }
  login(user:User){
    this.authServ.login(user).subscribe(res=>{
      this.router.navigate(['/dashboard']);
    },err=> this.errMessage=err.error.message);
  }

}
