import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as firebase from 'firebase';
import { User } from '../user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
}) 
export class AccountComponent implements OnInit {

  user:User = new User();
  user_post:any = [];
  user_bio:string;
  user_dob:string;
  user_city:string;
  noPost: boolean;
  urlimg:string;
  defaultImage: string = "assets/images/profile.jpg";

  constructor(private change:ChangeDetectorRef, private activatedRoute:ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      if(params.userid){
        this.user = JSON.parse(localStorage.getItem('user'));
      }else{
        this.user = JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  ngOnInit() {
    firebase.database().ref('posts/').orderByChild('userid').equalTo(this.user.userid).on('value', (res) => {
      this.user_post = [];
      for(let key in res.val()){
        this.user_post.unshift({key:key, value:res.val()[key]});
      }
      if(this.user_post.length === 0){
        this.noPost = true;
      }
      firebase.database().ref('signup/'+this.user.userid).on('value', (res) => {
        for(let key in res.val()){
          if(key === "bio"){           
            this.user.bio = res.val()[key];
            localStorage.setItem('user', JSON.stringify(this.user));
          }
        }     
      });
      firebase.database().ref('signup/'+this.user.userid).on('value', (res) => {
        for(let key in res.val()){
          if(key === "dob"){
            this.user.dob = res.val()[key];
            localStorage.setItem('user', JSON.stringify(this.user));
          }
        }     
      });
      firebase.database().ref('signup/'+this.user.userid).on('value', (res) => {
        for(let key in res.val()){
          if(key === "city"){
            this.user.city = res.val()[key];
            localStorage.setItem('user', JSON.stringify(this.user));
          }
        }     
      });
      firebase.database().ref('signup/'+this.user.userid).on('value', (res) => {
        for(let key in res.val()){
          if(key === "url"){
            this.user.url = res.val()[key];
            localStorage.setItem('user', JSON.stringify(this.user));
          }
        }     
      });
      this.change.detectChanges();
    });
  }

  removeStatus(p_key){
    firebase.database().ref('posts/').child(p_key).remove();
  }

  giveLike(post){
    firebase.database().ref('posts/'+post+'/like').update({[this.user.userid]: true});
    this.change.detectChanges();
  }

  getLikes(post){
    return (post.like === undefined)?'':Object.keys(post.like).length;
  }

  isLiked(post){
    return (post.like !== undefined && post.like[this.user.userid] !== undefined)? true : false;
  }

  saveBio(){
    firebase.database().ref('signup/'+this.user.userid).update({bio: this.user_bio});
  }

  saveDob(){
    firebase.database().ref('signup/'+this.user.userid).update({dob: this.user_dob});
    
  }

  saveCity(){
    firebase.database().ref('signup/'+this.user.userid).update({city: this.user_city});
  }

  saveUrl(){
    if(this.urlimg !== "" &&  this.urlimg !== " "){
      firebase.database().ref('signup/'+this.user.userid).update({url: this.urlimg});
      this.urlimg = "";
    }
  }

}
