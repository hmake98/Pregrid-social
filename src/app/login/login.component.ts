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

  constructor(private userservice: UserService, private router: Router) { }

  ngOnInit() {
    this.userservice.getUsers().subscribe(
      (res: Array<User>) => { this.users = res },
      (err) => console.log(err)
    );
  }

  login(){
    if(this.loginform.valid){
      for(let key in this.users){
        if(this.user.email === this.users[key].email && this.user.password === this.users[key].password){
          console.log("Account matched!");
          this.router.navigate(['/home']);
        }else{
          this.noAccount = true;
        }
      }
    }
  }

}
