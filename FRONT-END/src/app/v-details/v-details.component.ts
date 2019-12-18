import { Component, OnInit } from '@angular/core';
import { Subscription, Subscribable } from 'rxjs';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule, FormControl } from '@angular/forms';


@Component({
  selector: 'app-v-details',
  templateUrl: './v-details.component.html',
  styleUrls: ['./v-details.component.css']
})
export class VDetailsComponent {

  //// DETAILS POST /////
  weight: number;
  height: number;
  age: number;
  gender: string;
  detailsLoading: boolean = false;


  detailsSubscription: Subscription;
  data: object
  status: string

  //// DETAILS GET /////
  userDetailsSubscription: Subscription;
  userDetails: object;

  userWeight: number;
  userHeight: number;
  userAge: number;
  userIMC: number;
  userMB: number;
  userName: string;
  imcCorres: string;
  userProfile: string;

  detailsNotFound: string;


  //// VIEW CONTROLLER ////

  //DEFAULT: loggedIn
  vista: string = "loggedIn";

  //// DIETIST ////
  dietist: boolean = false;

  constructor(
    public _user: UserService,
    public _router: Router
  ) {

    //// DETAILS POST /////

    this.detailsSubscription = this._user.detailsData.subscribe(
      (newValue) => {
        this.data = newValue
        setTimeout(() => {
          this.status = this.data["status"]

          if (this.status === "Details updated!") {
            this.detailsLoading = true;
            this.getDetails();
            this.vista = 'showDetails'
          } else {
            console.log(this.status)
            return false;

          }

        }, 3000);

      }
    )


    this.userDetailsSubscription = this._user.userDetails.subscribe(
      (newValue) => {
        this.userDetails = newValue
        if (this.userDetails !== undefined) {
          this.userWeight = this.userDetails["data"]["weight"];
          this.userHeight = this.userDetails["data"]["height"];
          this.userAge = this.userDetails["data"]["age"];
          this.userIMC = this.userDetails["data"]["IMC"];
          this.userMB = this.userDetails["data"]["basal"];
          this.userName = this.userDetails["data"]["name"];

          //IMC
          if (this.userIMC <= 18.5) {
            this.imcCorres = "Underweight - You should gain weight"
          } else if (this.userIMC >= 18.4 && this.userIMC <= 24.9) {
            this.imcCorres = "Healthy Weight - Keep this way!"
          } else if (this.userIMC >= 25 && this.userIMC <= 29.9) {
            this.imcCorres = "Overweight - You should lose weight"
          } else if (this.userIMC >= 30) {
            this.imcCorres = "Obese - You should go to de nutritionist"
          } else {
            this.imcCorres = "Undefined correspondence"
          }

        } else {
          this.detailsNotFound = "Something went wrong. Please try again."
          this.vista = "loggedIn";
        }


      }
    )

  }

  //// DETAILS POST /////

  sendData(form: FormControl): any {

    //Si la form és vàlida envio les dades
    if (form.valid) {
      this._user.calculate(this.weight, this.height, this.age, this.gender)

      //Mostro el loading
      this.detailsLoading = true;

      //Deixo de mostrar el loading
      setTimeout(() => {
        form.reset();
        this.detailsLoading = false;
      }, 5000);
    } else {
      return false;
    }
  }

  //// DETAILS GET /////

  getDetails() {
    this._user.getDetails();
    setTimeout(() => {
      this.weight = undefined;
      this.height = undefined;
      this.age = undefined;
      this.gender = undefined;
      this.status = undefined
    }, 5000);

  }

  ///// SELECT VIEW ////

  changeView(): void {
    this.vista = "loggedIn"
  }

  //// LOGOUT /////

  logout() {
    this._user.logout();
    this.vista = "loggedOut";
    setTimeout(() => {
      this._router.navigateByUrl("/home")
    }, 3000);
  }

  ///// SELECT VIEW ////

  ngOnInit(): void {
    if (localStorage.getItem("detailed") == "true") {
      this.getDetails();
      this.vista = "showDetails"
    } else {
      this.vista = "loggedIn"
    }
    if (localStorage.getItem("dietist") == "true") {
      this.dietist = true;
    } else {
      this.dietist = false;
    }
  }


}
