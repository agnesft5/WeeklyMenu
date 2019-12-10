import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-v-login',
  templateUrl: './v-login.component.html',
  styleUrls: ['./v-login.component.css']
})
export class VLoginComponent {

  username: string;
  password: string;
  loginLoad: boolean = false;


  loginSubscription: Subscription;
  loginData: object
  status: string

  constructor(public _user: UserService,
    public _router: Router) {

    this.loginSubscription = _user.loginData.subscribe(
      (newValue) => {
        this.loginData = newValue
        setTimeout(() => {
          this.status = this.loginData["status"]

          if (this.status === "You are logged!") {
            this.loginLoad = true;
            console.log(this.status)
            setTimeout(() => {
              this._router.navigateByUrl("/details")
            }, 2000);
          } else {
            console.log(this.status)
            return false;

          }

        }, 2000);

      }
    )

  }

  sendData(form: FormControl): any {

    //Si la form és vàlida envio les dades
    if (form.valid) {
      this._user.login(this.username, this.password)

      //Mostro el loading
      this.loginLoad = true;

      //Deixo de mostrar el loading
      setTimeout(() => {
        this.loginLoad = false;
      }, 2000);
    } else {
      return false;
    }
  }
}