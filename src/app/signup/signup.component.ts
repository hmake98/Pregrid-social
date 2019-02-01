import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../user.model'; 
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('f') userform:NgForm;
  user:User = new User(); 
  cfmpas:string;


  constructor() { 
    this.user.gender = "";
  }

  ngOnInit() {
  }

  signup(){
    console.log(this.userform.value);
    console.log(this.user);
  }

}
