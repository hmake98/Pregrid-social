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
  post_db_Ref:any;
  null_posts: boolean;
  news_posts = [];
  showLoader:boolean;
  open: boolean;
  edit_post: string;
  photosContainer = [];
  blobContainer = [];

  constructor(private postservice:PostService, private change:ChangeDetectorRef, private userservice:UserService, private router:Router) {
    this.user = JSON.parse(localStorage.getItem('user'));
    //console.log(this.user.userid);  
    this.post.userid = this.user.userid;
    //this.getPosts();
  }

  ngOnInit() {
    this.showLoader = true;
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
            this.showLoader = false;
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
      text: "Are you sure! you want to Delete?",
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
    firebase.database().ref('posts/'+post.postid+'/unlike/'+this.user.userid).remove();
    this.change.detectChanges();
  }

  giveUnLike(post){
    firebase.database().ref('posts/'+post.postid+'/unlike').update({[this.user.userid]: true});
    firebase.database().ref('posts/'+post.postid+'/like/'+this.user.userid).remove();
    this.change.detectChanges();
  }

  getLikes(post){
    return (post.like === undefined)?'':Object.keys(post.like).length;
  }

  getUnLikes(post){
    return (post.unlike === undefined)?'':Object.keys(post.unlike).length;
  }

  isLiked(post){
    return (post.like !== undefined && post.like[this.user.userid] !== undefined)? true : false;
  }

  isUnLiked(post){
    return (post.unlike !== undefined && post.unlike[this.user.userid] !== undefined)? true : false;
  }

  toProfile(post){
    this.router.navigate(['/account/'+post.userid]);
  }

  editPost(i, item){
    this.edit_post = item.status;
    document.getElementsByClassName("edit")[i]['style'].display = 'block'; 
    document.getElementsByClassName("hide_edit")[i]['style'].display = 'none';
    document.getElementsByClassName("edit")[i]['value'] = this.edit_post;
  }

  cancelPost(i){
    document.getElementsByClassName("edit")[i]['style'].display = 'none';
    document.getElementsByClassName("hide_edit")[i]['style'].display = 'block';
    document.getElementsByClassName("editer")[i]['value'] = '';
  }

  saveEditedPost(post, edit_post, i){
    firebase.database().ref('posts/'+post.postid).update({status: edit_post.value});
    document.getElementsByClassName("edit")[i]['style'].display = 'none';
    document.getElementsByClassName("hide_edit")[i]['style'].display = 'block';
  }

  uploadImage(event){
    let temp = event.srcElement.files;
    let container = document.getElementById("photos-container");
    container.innerHTML = '';
    for(let key in temp){
      this.photosContainer.push(temp[key]);
      let reader = new FileReader();
      reader.onload = (e) => {
        let div = document.createElement("div");
        div.setAttribute("class", "col-md-6");
        let img = document.createElement("img");
        img.setAttribute("src", e.target['result']);
        img.classList.add("img-gallery");
        let del = document.createElement("i");
        del.setAttribute("name", temp[key].name);
        del.classList.add("fas","fa-trash","delete");
        del.addEventListener("click", (event:any) => {
          //console.log(event.path[0].attributes[0].value);
          let name = event.path[0].attributes[0].value;
          event.target.closest('div').parentNode.removeChild(event.target.closest('div'));
          for(let i in temp){
            let file_name = temp[i].name;
            console.log(file_name, name, file_name === name);
            if(temp[i].name === name){
              delete temp[i];
            }
          }
          console.log(temp);
        });
        div.appendChild(del);
        div.appendChild(img);
        container.appendChild(div);
      }
      reader.readAsDataURL(this.photosContainer[key]);
    }
    
    

  }
    
    // console.log(event.srcElement.files[0]);
    // this.photosContainer.push(event.srcElement.files[0]);
    // console.log(this.photosContainer);
    // this.photosContainer.forEach(element => {
    //   let blobFile = new Blob([element]);
    //   this.blobContainer.push(blobFile);
    // });
    // this.blobContainer.forEach(element => {
    //   //console.log(element);
    //   firebase.storage().ref(this.user.userid+'/'+event.srcElement.files[0].name).put(element).then((snapshot) => {
    //     snapshot.ref.getDownloadURL().then((res) => {
    //       console.log(res);
    //       this.urlContainer.push(res);
    //     });
    //   });
    //   console.log(this.urlContainer);

    // });

}

