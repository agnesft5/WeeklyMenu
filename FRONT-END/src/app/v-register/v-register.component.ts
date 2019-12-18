import { Component, OnInit } from '@angular/core';
import { FormsModule, Form, FormControl, NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { registerLocaleData } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { format } from 'url';


@Component({
  selector: 'app-v-register',
  templateUrl: './v-register.component.html',
  styleUrls: ['./v-register.component.css']
})
export class VRegisterComponent {

  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  dietistTrue: string;

  registerLoad: boolean = false;

  registerSubscription: Subscription;
  registerData: object
  status: string;

  loginSubscription: Subscription;
  loginData: object;
  loginStatus: string;

  constructor(
    public _user: UserService,
    public _router: Router) {

    this.registerSubscription = _user.registerData.subscribe(
      (newValue) => {
        this.registerData = newValue
        setTimeout(() => {
          this.status = this.registerData["status"]

          if (this.status === "Registered successfully!") {
            this.registerLoad = true
            console.log(this.status)
            setTimeout(() => {


              // this._router.navigateByUrl("/login")


              this._user.login(this.username, this.password)


              this.loginData = _user.loginData.subscribe(
                (newLogValue) => {
                  this.loginData = newLogValue
                  setTimeout(() => {
                    this.loginStatus = this.loginData["status"]
                    if (this.loginStatus === "You are logged!") {
                      this.status = this.loginStatus
                      console.log(this.status)
                      setTimeout(() => {
                        this._router.navigateByUrl("/details")
                      }, 1000);
                    } else {
                      console.log(this.loginStatus)
                      return false;

                    }
                  }, 2000);
                }
              )


            }, 2000);
          } else {
            console.log(this.status)
            return false;

          }

        }, 2000);

      }
    )

  }

  sendData(form: NgForm): any {

    //Si la form és vàlida envio les dades
    if (form.valid) {
      this._user.logout();
      this._user.register(this.name, this.lastName, this.username, this.email, this.password, this.dietistTrue)
      //Mostro el loading
      this.registerLoad = true;

      //Deixo de mostrar el loading
      setTimeout(() => {
        this.registerLoad = false;
      }, 2000);
    } else {
      return false;
    }
  }

}