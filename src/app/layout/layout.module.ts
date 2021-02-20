import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import * as firebase from "firebase";
import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebaseConfig);

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
        HomeComponent,
        AccountComponent,
        HeaderComponent,
    ],
    imports: [
        NgSelectModule,
        FormsModule,
        RouterModule,
        CommonModule,
        BrowserModule,
        FormsModule,
    ],
    providers: [],
})

export class LayoutModule { }
