import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn:boolean;
  constructor(private authService:AuthService,private router:Router) {
    this.authService.loggedIn.subscribe(status=> this.isLoggedIn=status);
   }

  ngOnInit(): void {
      this.isLoggedIn=this.authService.isLoggedIn();
  }
  logOut(){
    this.authService.logout();
    this.router.navigate(['/'])
  }
}
