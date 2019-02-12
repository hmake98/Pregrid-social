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

  constructor(private change:ChangeDetectorRef) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    firebase.database().ref('posts/').on('value', (res) => {
      this.user_post = [];
      for(let key in res.val()){
        //console.log(res.val()[key].userid);
        if(res.val()[key].userid === this.user.userid){
          this.user_post.unshift({key:key, value:res.val()[key]});
        }
      }
      this.change.detectChanges();
      console.log(res.val());
    });
    console.log(this.user_post);
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

}
