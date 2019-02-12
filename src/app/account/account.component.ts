import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../user.model';
import * as firebase from 'firebase';
import { Post } from '../post.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
}) 
export class AccountComponent implements OnInit {

  user:User;
  user_post:any = [];
  user_bio:string;
  user_dob:string;
  user_city:string;
  avail_bio:boolean;
  avail_dob:boolean;
  avail_city:boolean;

  constructor(private change:ChangeDetectorRef) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    firebase.database().ref('posts/').orderByChild('userid').equalTo(this.user.userid).on('value', (res) => {
      this.user_post = [];
      for(let key in res.val()){
        //console.log(res.val()[key].userid);
        //if(res.val()[key].userid === this.user.userid){
          this.user_post.unshift({key:key, value:res.val()[key]});
        //}
      }
      this.change.detectChanges();
    });
    firebase.database().ref('signup/'+this.user.userid).on('value', (res) => {
      for(let key in res.val()){
        if(res.val()[key].bio){
          this.avail_bio = true;
          this.user_bio = res.val()[key].bio;
        }
      }
    });
  }

  removeStatus(p_key){
    firebase.database().ref('posts/').child(p_key).remove();
  }

  giveLike(post){
    debugger
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
    console.log(this.user_bio);
    firebase.database().ref('signup/'+this.user.userid).update({bio: this.user_bio});
  }

  saveDob(){
    console.log(this.user_dob);
    firebase.database().ref('signup/'+this.user.userid).update({dob: this.user_dob});
    
  }

  saveCity(){
    console.log(this.user_city);
    firebase.database().ref('signup/'+this.user.userid).update({city: this.user_city});
  }

}
