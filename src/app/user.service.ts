import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUsers(){
    return this.http.get("https://pregrid-social.firebaseio.com/signup.json");
  }

  getNews(){
    return this.http.get("https://newsapi.org/v2/top-headlines?country=in&apiKey=4f212a90e7e54cc7a22808daf2dc9545");
  }

}

