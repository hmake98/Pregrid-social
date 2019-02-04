import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { LogUser } from '../login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('f') loginform:NgForm;
  users: Array<User> = [];
  user:LogUser = new LogUser();
  noAccount:boolean = false;
  invalidPass:boolean = false;
  loggedIn: boolean = false;

  constructor(private userservice: UserService, private router: Router) { }

  ngOnInit() {
    this.userservice.getUsers().subscribe(
      (res: Array<User>) => { this.users = res },
      (err) => console.log(err)
    );
  }

  login(loginform){
    if(this.loginform.valid){
      let usersList = [];
      for(let key in this.users){
        usersList.push(this.users[key]);
      }
      let matchedUser = usersList.filter(u => u.email.toLowerCase() == this.user.email.toLowerCase());
      if(matchedUser.length === 0){
        setTimeout(()=>{
          debugger
          this.noAccount = true;
        },1000);
        this.noAccount = false;
      } else if(matchedUser[0].password !== this.user.password){
        setTimeout(()=>{
          this.invalidPass = true;
        },1000);
        this.invalidPass = false;
      } else {
        this.loggedIn = true;
        localStorage.setItem('user', JSON.stringify(matchedUser[0]));
        this.router.navigate(['/home']);
      }
    }
  }

}
