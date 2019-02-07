import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../user.model'; 
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

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

  constructor(private userservice:UserService, private router: Router) { 
    this.user.gender = "";
  }

  ngOnInit() {
    if(localStorage.getItem('user')){ 
      this.router.navigate(['/home']);
    }
  }

  signup(userform){
    if(this.userform.valid){
      this.userservice.signupUser(this.user).subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      )
      this.userform.reset();
      this.loggedIn = true;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.router.navigate(['/home']);
    }
  }

}
