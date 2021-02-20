import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  user: User;
  finduser: string;
  users = [];
  userDataCall;

  constructor(private router: Router) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.userDataCall = firebase.database().ref('signup/').on('value', (res) => {
       for (let key in res.val()) {
          this.users.push({name: res.val()[key].name, userid:key});
        }
    });
  }

  goProfile(){
    this.router.navigate(['/account/'+this.finduser]);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

}
