import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
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
          this.users.push(res.val()[key].name);
        }
    });
  }

  ngOnDestroy(): void {
    //this.userDataCall.off();
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

}
