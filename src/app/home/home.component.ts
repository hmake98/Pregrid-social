import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user:User;

  constructor() { 
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {

  }

}
