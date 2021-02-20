import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get("https://pregrid-social.firebaseio.com/signup.json");
  }

  getNews() {
    return this.http.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${environment.newsApiKey}`);
  }

}

