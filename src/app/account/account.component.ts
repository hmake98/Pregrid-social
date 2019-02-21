import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as firebase from 'firebase';
import { User } from '../user.model';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
declare var $:any;
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
  exist_user: boolean = true;
  showSpinner: boolean;
  imageName: string;
  imageSize: number;
  blobFile:any;


  constructor(private change:ChangeDetectorRef, private activatedRoute:ActivatedRoute) {
    this.showSpinner = true;
    this.activatedRoute.params.subscribe(params => {
      if(params.userid){
        firebase.database().ref('signup/'+params.userid).on('value', (res)=>{   
          this.user = {...res.val(), userid:params.userid};
          this.getUser();
        });
      }else{
        this.user = JSON.parse(localStorage.getItem('user'));
        this.getUser();
      }
    });
  }

  ngOnInit() {
  }

  getUser() {
    let temp_user = JSON.parse(localStorage.getItem('user'));
    if(this.user.userid === temp_user.userid){    
      this.exist_user = true;
      firebase.database().ref('posts/').orderByChild('userid').equalTo(this.user.userid).on('value', (res) => {
        this.user_post = [];
        for(let key in res.val()){
          this.user_post.unshift({key:key, value:res.val()[key]});
        }
        this.showSpinner = false;

        if(this.user_post.length === 0){
          this.noPost = true;
        }

        firebase.database().ref('signup/'+this.user.userid).on('value', (res) => {
          for(let key in res.val()){
            if(key === "bio"){
              this.user.bio = res.val()[key];
              localStorage.setItem('user', JSON.stringify(this.user));
            }
            if(key === "dob"){
              this.user.dob = res.val()[key];
              localStorage.setItem('user', JSON.stringify(this.user));
            }
            if(key === "city"){
              this.user.city = res.val()[key];
              localStorage.setItem('user', JSON.stringify(this.user));
            }
            if(key === "url"){
              this.user.url = res.val()[key];
              localStorage.setItem('user', JSON.stringify(this.user));
            }
          }  
        });
      });
    }else{
      this.exist_user = false;
      firebase.database().ref('posts/').orderByChild('userid').equalTo(this.user.userid).on('value', (res) => {
        this.user_post = [];

        for(let key in res.val()){
          this.user_post.unshift({key:key, value:res.val()[key]});
        }
        this.showSpinner = false;

        if(this.user_post.length === 0){
          this.noPost = true;
        }
      });   
    }
  }

  changeRef(){
    this.change.detectChanges();
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

  saveImage(event){
    this.imageName = event.srcElement.files[0].name;
    document.getElementById("hola").innerHTML = this.imageName;
    this.imageSize = event.srcElement.files[0].size/1024;
    const file = event.srcElement.files[0]
    this.blobFile = new Blob([file]);
  }

  save(){
    if(this.urlimg){
      if(this.urlimg !== "" &&  this.urlimg !== " "){
        firebase.database().ref('signup/'+this.user.userid).update({url: this.urlimg});
        this.urlimg = "";
      }
    }
    firebase.storage().ref('/userprofile/'+this.imageName).put(this.blobFile).then((snapshot) => {
      snapshot.ref.getDownloadURL().then((res) => {
        this.user.url = res;
        firebase.database().ref('signup/'+this.user.userid).update({url: res});
        console.log(this.user.url);
        localStorage.setItem('user', JSON.stringify(this.user));
      });
    });
    $('#exampleModal').modal('hide');
  }

}
