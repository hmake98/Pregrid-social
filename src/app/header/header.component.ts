import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  user:User;
  selectuser:string;

  constructor(private router:Router) { 
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
  }

  logout(){
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  searchUser(){
    console.log(this.selectuser); 
  }

}
