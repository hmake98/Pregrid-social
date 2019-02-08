import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User } from '../user.model';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @ViewChild('f') postForm:NgForm;
  user:User;
  post:Post = new Post();
  posts:Array<Post> = [];
  username:string;
  users:any;
  user_post = [];
  allowDelete:boolean = false;
  likes_count;
  post_db_Ref:any;

  constructor(private postservice:PostService, private change:ChangeDetectorRef) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.post.userid = this.user.userid;
    //this.getPosts();
  }

  ngOnInit() {
    let now = new Date();
    let current = this;
    current.users = firebase.database().ref('signup/').once('value', (res) => {
      current.users = res.val();
      this.post_db_Ref = firebase.database().ref('posts/').orderByChild("timestamp")
      this.post_db_Ref.on('value', (snapshot) => {
        current.user_post = [];
        for(let key in snapshot.val()){
          let ser = snapshot.val()[key];
          ser.postid = key;
          ser.name = current.users[snapshot.val()[key].userid].name;
          current.user_post.unshift(ser); 
        }
        current.change.detectChanges();
      });
      
    });
  }

  ngOnDestroy(): void {
    this.post_db_Ref.off();    
  }

  postStatus(postForm){
    let now = new Date();
    this.post.timestamp = now.getTime();
    let trimmed_status = this.post.status.trim();
    this.post.status = trimmed_status;
    firebase.database().ref('posts/').push(this.post);  
    this.postForm.reset();
  }

  removeStatus(p_key){
    firebase.database().ref('posts/').child(p_key).remove();
  }

  giveLike(post){
    firebase.database().ref('posts/'+post.postid+'/like').update({[this.user.userid]: true});
    this.change.detectChanges();
  }

  getLikes(post){
    return (post.like === undefined)?'':Object.keys(post.like).length;
  }

  isLiked(post){
    return (post.like !== undefined && post.like[this.user.userid] !== undefined)? true : false;
  }

}

