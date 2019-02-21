import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../user.model'; 
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('f') userform:NgForm;
  user:User = new User(); 
  cfmpas:string;
  loggedIn: boolean = false;
  userpass:string;

  constructor(private router: Router) { 
    this.user.gender = "";
  }

  ngOnInit() {
    if(localStorage.getItem('user')){ 
      this.router.navigate(['/home']);
    }
  }

  signup(userform){
    if(this.userform.valid){
      let encrptPass = window.btoa(this.userpass);
      this.user.password = encrptPass;
      firebase.database().ref('signup/').push(this.user).then(res => {
        this.loggedIn = true;
        localStorage.setItem('user', JSON.stringify({...this.user, userid: res.key}));
        this.router.navigate(['/home']);
      });
    }
  }

}
