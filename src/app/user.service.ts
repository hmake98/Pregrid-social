import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  signupUser(data){
    return this.http.post("https://pregrid-social.firebaseio.com/signup.json", data);
  }

  getUsers(){
    return this.http.get("https://pregrid-social.firebaseio.com/signup.json");
  }

}
