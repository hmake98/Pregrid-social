import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }

  postStatus(data){
    return this.http.post("https://pregrid-social.firebaseio.com/posts.json", data);
  }

  getPosts(){
    return this.http.get("https://pregrid-social.firebaseio.com/posts.json");
  }
}
