import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @ViewChild('f') postForm: NgForm;
  user: User;
  post: Post = new Post();
  posts: Array<Post> = [];
  username: string;
  users: any;
  user_post = [];
  allowDelete: boolean = false;
  post_db_Ref: any;
  null_posts: boolean;
  news_posts = [];
  showLoader: boolean;
  open: boolean;
  edit_post: string;
  photosContainer = [];
  currentText: string;
  postUrls = [];
  promises = [];
  showPlaceholder: boolean;

  constructor(private change: ChangeDetectorRef, private userservice: UserService, private router: Router) {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.post.userid = this.user.userid;
    } else {
      swal({
        text: "Not logged in",
        icon: "warning",
        dangerMode: true
      })
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.showLoader = true;
    let current = this;
    firebase.database().ref('signup/').once('value', (res) => {
      current.users = res.val();
      this.post_db_Ref = firebase.database().ref('posts/').orderByChild("timestamp")
      this.post_db_Ref.on('value', (snapshot) => {
        current.user_post = [];
        for (let key in snapshot.val()) {
          let ser: any = snapshot.val()[key];
          ser.postid = key;
          ser.name = current.users[snapshot.val()[key].userid].name;
          ser.url = current.users[snapshot.val()[key].userid].url;
          if (ser.post_status === "Public") {
            current.user_post.unshift(ser);
            this.showLoader = false;
          }
        }
        if (this.user_post.length === 0) {
          this.null_posts = true;
        }
        current.change.detectChanges();
      });
    });
    this.userservice.getNews().subscribe(
      (res) => {
        this.news_posts.push(...res['articles']);
      },
      (err) => console.log(err)
    );
  }

  // ngOnDestroy(): void {
  //   this.post_db_Ref.off();
  // }

  postStatus(postForm) {
    let container = document.getElementById("photos-container");
    container.innerHTML = '';
    let promises = [];
    /* Promise Code */
    if (this.photosContainer.length != 0) {
      this.showPlaceholder = true;
      for (let i = 0; i < this.photosContainer.length; i++) {
        let ext = this.photosContainer[i].name.split('.').pop();
        promises.push(
          new Promise((resolve, reject) => {
            firebase.storage().ref(this.user.userid).child('post_image_' + Date.now() + '_' + this.generateGuid() + '.' + ext).put(this.photosContainer[i]).then((snapshot) => {
              snapshot.ref.getDownloadURL().then((res) => {
                this.postUrls.push(res);
                resolve();
              });
            }).catch((err) => {
              console.log(err);
              reject(err);
            });
          })
        );
      }
      Promise.all(promises).then(result => {
        this.post.post_images = this.postUrls;
        this.post.timestamp = Date.now();
        if (this.post.post_status === undefined) {
          this.post.post_status = "Public";
        }
        firebase.database().ref('posts/').push(this.post);
        this.showPlaceholder = false;
        //this.postForm.reset();
        this.photosContainer = [];
      });
    } else if (this.post.status) {
      this.post.post_images = this.postUrls;
      this.post.timestamp = Date.now();
      if (this.post.post_status === undefined) {
        this.post.post_status = "Public";
      }
      firebase.database().ref('posts/').push(this.post);
      this.post.status = '';
      this.showPlaceholder = false;
      //this.postForm.reset();
      this.photosContainer = [];
    } else {
      swal("Oops", "Insert something!", "error");
    }
  }

  generateGuid() {
    let result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20)
        result = result + '-';
      i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
      result = result + i;
    }
    return result;
  }

  removeStatus(p_key) {
    swal({
      text: "Are you sure! you want to Delete?",
      icon: "warning",
      buttons: ["Cancel", true],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          firebase.database().ref('posts/').child(p_key).remove();
        }
      });
  }

  giveLike(post) {
    firebase.database().ref('posts/' + post.postid + '/like').update({ [this.user.userid]: true });
    firebase.database().ref('posts/' + post.postid + '/unlike/' + this.user.userid).remove();
    this.change.detectChanges();
  }

  giveUnLike(post) {
    firebase.database().ref('posts/' + post.postid + '/unlike').update({ [this.user.userid]: true });
    firebase.database().ref('posts/' + post.postid + '/like/' + this.user.userid).remove();
    this.change.detectChanges();
  }

  getLikes(post) {
    return (post.like === undefined) ? '' : Object.keys(post.like).length;
  }

  getUnLikes(post) {
    return (post.unlike === undefined) ? '' : Object.keys(post.unlike).length;
  }

  isLiked(post) {
    return (post.like !== undefined && post.like[this.user.userid] !== undefined) ? true : false;
  }

  isUnLiked(post) {
    return (post.unlike !== undefined && post.unlike[this.user.userid] !== undefined) ? true : false;
  }

  toProfile(post) {
    this.router.navigate(['/account/' + post.userid]);
  }

  editPost(i, item) {
    this.currentText = item.status;
    document.getElementsByClassName("edit")[i]['style'].display = 'block';
    document.getElementsByClassName("hide_edit")[i]['style'].display = 'none';
    document.getElementsByClassName("edit")[i]['value'] = this.edit_post;
  }

  cancelPost(i) {
    document.getElementsByClassName("edit")[i]['style'].display = 'none';
    document.getElementsByClassName("hide_edit")[i]['style'].display = 'block';
    document.getElementsByClassName("editer")[i]['value'] = '';
  }

  saveEditedPost(post, edit_post, i) {
    firebase.database().ref('posts/' + post.postid).update({ status: edit_post.value });
    document.getElementsByClassName("edit")[i]['style'].display = 'none';
    document.getElementsByClassName("hide_edit")[i]['style'].display = 'block';
  }

  uploadImage(event) {
    this.photosContainer = [];
    let temp = event.srcElement.files;
    let container = document.getElementById("photos-container");
    container.innerHTML = '';
    for (let key in temp) {
      if (typeof temp[key] == "object") {
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
          del.classList.add("fas", "fa-trash", "delete");
          del.addEventListener("click", (event: any) => {
            let name = event.path[0].attributes[0].value;
            this.photosContainer.forEach(element => {
              if (element.name === name) {
                let index = this.photosContainer.indexOf(element);
                this.photosContainer.splice(index, 1);
                event.target.closest('div').parentNode.removeChild(event.target.closest('div'));
              }
            });
          });
          div.appendChild(del);
          div.appendChild(img);
          container.appendChild(div);
        }
        reader.readAsDataURL(new Blob([temp[key]]));
      }
    }
  }

}

