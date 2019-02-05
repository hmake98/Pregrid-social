import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';

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

  constructor(private postservice:PostService) {
    firebase.initializeApp(environment.firebaseConfig); 
    this.user = JSON.parse(localStorage.getItem('user'));
    this.post.userid = this.user.userid;
    //this.getPosts();
  }

  ngOnInit() {
    let current = this;
    current.users = firebase.database().ref().child('signup/').once('value', (res) => {
      current.users = res.val();
      firebase.database().ref('posts/').on('value', (snapshot) => {
        for(let key in snapshot.val()){
          let ser = snapshot.val()[key];
          ser.name = current.users[snapshot.val()[key].userid].name;
          current.user_post.forEach(element => {
            //console.log(element.name, this.user.name, element.name === this.user.name);
            if(element.name === this.user.name){
              ser.delete = true;
            }
          });
          current.user_post.push(ser);
          //console.log(current.user_post);
        }
      });
    });
  }

  // getPosts(){
  //   this.postservice.getPosts().subscribe(
  //     (res:Array<Post>) => { 
  //       for(let key in res){
  //         this.posts.push({...res[key], postid:key});
  //       }
  //      },
  //     (err) => console.log(err)
  //   );
  // }

  postStatus(postForm){
    this.postservice.postStatus(this.post).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
    this.postForm.reset();
  }
}
