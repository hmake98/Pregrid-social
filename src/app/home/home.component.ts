import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User } from '../user.model';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';

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
  null_posts: boolean;
  news_posts = [];

  constructor(private postservice:PostService, private change:ChangeDetectorRef, private userservice:UserService, private router:Router) {
    this.user = JSON.parse(localStorage.getItem('user'));
    //console.log(this.user.userid);  
    this.post.userid = this.user.userid;
    //this.getPosts();
  }

  ngOnInit() {
    let current = this;
    firebase.database().ref('signup/').once('value', (res) => {
      current.users = res.val();    
      this.post_db_Ref = firebase.database().ref('posts/').orderByChild("timestamp")
      this.post_db_Ref.on('value', (snapshot) => {
        current.user_post = [];
        for(let key in snapshot.val()){
          let ser:any = snapshot.val()[key];
          ser.postid = key;     
          ser.name = current.users[snapshot.val()[key].userid].name;
          ser.url = current.users[snapshot.val()[key].userid].url;       
          if(ser.post_status === "Public"){
            current.user_post.unshift(ser);
          }
        }
        if(this.user_post.length === 0){
          this.null_posts = true;
        }
        current.change.detectChanges();
      });  
    });
    this.userservice.getNews().subscribe(
      (res) => {
        this.news_posts.push(...res['articles']);
      }, 
      (err) => console.log(err) );
  }

  ngOnDestroy(): void {
    this.post_db_Ref.off();
  }

  postStatus(postForm){
    if(this.post.status !== undefined && this.post.status !== ""){
      let now = new Date();
      this.post.timestamp = now.getTime();
      let trimmed_status = this.post.status.trim();
      this.post.status = trimmed_status;
      if(this.post.post_status === undefined){
        this.post.post_status = "Public";
      }
      firebase.database().ref('posts/').push(this.post);
      this.postForm.reset();
    }
  }

  removeStatus(p_key){
    //firebase.database().ref('posts/').child(p_key).remove();
    swal({
      text: "Are you sure want to Delete?",
      icon: "warning",
      buttons: ["Cancel",true],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        firebase.database().ref('posts/').child(p_key).remove();
        swal("Your post has been deleted!", {
          icon: "success",
        });
      }
    });
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

  toProfile(post){
    this.router.navigate(['/account/'+post.userid]);
  }

}

