import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { LogUser } from '../login.model';
import { Router } from '@angular/router';
import swal from 'sweetalert';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('f') loginform: NgForm;
  users: Array<User> = [];
  user: LogUser = new LogUser();
  noAccount: boolean = false;
  invalidPass: boolean = false;
  loggedIn: boolean = false;

  constructor(private userservice: UserService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      swal("Already logged in!", "Continue to home.");
      this.router.navigate(['/home']);
    } else {
      this.userservice.getUsers().subscribe(
        (res: Array<User>) => { this.users = res },
        (err) => console.log(err)
      );
    }
  }

  login(loginform) {
    if (this.loginform.valid) {
      let usersList = [];
      for (let key in this.users) {
        usersList.push({ ...this.users[key], userid: key });
      }
      let matchedUser = usersList.filter(u => u.email.toLowerCase() == this.user.email.toLowerCase());
      if (matchedUser.length === 0) {
        this.noAccount = true;
        setTimeout(() => {
          this.noAccount = false;
        }, 2000);
      } else if (matchedUser[0].password !== this.user.password) {
        this.invalidPass = true;
        setTimeout(() => {
          this.invalidPass = false;
        }, 2000);
      } else {
        this.loggedIn = true;
        localStorage.setItem('user', JSON.stringify(matchedUser[0]));
        this.router.navigate(['/home']);
      }
    }
  }

}
