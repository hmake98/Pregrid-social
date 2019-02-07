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

  constructor(private postservice:PostService, private change:ChangeDetectorRef) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.post.userid = this.user.userid;
    //this.getPosts();
  }

  ngOnInit() {
    let current = this;
    current.users = firebase.database().ref('signup/').once('value', (res) => {
      current.users = res.val();
      firebase.database().ref('posts/').on('value', (snapshot) => {
        current.user_post = [];
        for(let key in snapshot.val()){
          let ser = snapshot.val()[key];
          ser.postid = key;
          ser.name = current.users[snapshot.val()[key].userid].name;
          current.user_post.push(ser);
        }
        current.change.detectChanges();
      });
      
    });
  }

  postStatus(postForm){
    firebase.database().ref('posts/').push(this.post);
    this.postForm.reset();
  }

  removeStatus(p_key){
    firebase.database().ref('posts/').child(p_key).remove();
  }

  giveLike(post){
    if(post.like !== undefined){ }
    firebase.database().ref('posts/'+post.postid+'/like').update({[this.user.userid]: true});
    this.user_post.forEach(element => {
      let count = 0;
      for(let i in element.like){
        count++;
      }
      firebase.database().ref('posts/'+post.postid).update({likes: count});
    });
    this.change.detectChanges();
  }

}

