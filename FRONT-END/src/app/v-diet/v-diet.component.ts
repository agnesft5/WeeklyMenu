import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-v-diet',
  templateUrl: './v-diet.component.html',
  styleUrls: ['./v-diet.component.css']
})
export class VDietComponent implements OnInit {


  //loading
  vista: string = "loading"
  details: string = 'none'


  ////// DAYS //////
  days: string[] = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
  ]

  ////////////DIET////////////
  /////// POST /////////
  postSubscription: Subscription;
  postDietData: object;
  dietData: object;
  dietID: string;

  /////// GET /////////
  getSubscription: Subscription;
  getDietData: object;
  gotDiet: object;
  dietMenus: object[];

  //MENUS//
  menu1: object;
  menu2: object;
  menu3: object;
  menu4: object;
  menu5: object;
  menu6: object;
  menu7: object;

  ////////////////////////

  starter_lunch: string;
  main_lunch: string;
  dessert_lunch: string;

  starter_dinner: string;
  main_dinner: string;
  dessert_dinner: string;

  //////////// USER DETAILS////////////

  detailsSubscription: Subscription;
  userDetails: object;

  userName: string;

  //////////// DIETIST ///////////////
  dietist: boolean = false;

  constructor(
    public _user: UserService,
    public _router: Router) {

    this.postSubscription = this._user.postDietData.subscribe(
      (newValue) => {
        this.postDietData = newValue;
        this.dietData = this.postDietData['data']
        this.dietID = this.dietData['_id']
        console.log(this.dietID)
        this._user.getDiet(this.dietID);
        this.getSubscription = this._user.dietData.subscribe(
          (newValue) => {
            this.getDietData = newValue;
            this.gotDiet = this.getDietData['data']
            this.dietMenus = this.gotDiet['menus'];
            this.menu1 = this.dietMenus[0];
            this.menu2 = this.dietMenus[1];
            this.menu3 = this.dietMenus[2];
            this.menu4 = this.dietMenus[3];
            this.menu5 = this.dietMenus[4];
            this.menu6 = this.dietMenus[5];
            this.menu7 = this.dietMenus[6];
          }
        )
      }
    )

    this.detailsSubscription = this._user.userDetails.subscribe(
      (newValue) => {
        this.userDetails = newValue;
        this.userName = this.userDetails['data']['name'];
      }
    )
  }



  changeView() {
    setTimeout(() => {
      this.vista = "loggedIn"
    }, 5000);
  }

  showDetails(view, event) {
    this.details = view
    if (event.detail == 2) {
      this.details = "none"
    }
  }

  //// LOGOUT /////

  logout() {
    this._user.logout();
    this.vista = "loggedOut";
  }

  ngOnInit() {

    this._user.createDiet();
    this._user.getDetails();
    this.changeView();
    if (localStorage.getItem("dietist") == "true") {
      this.dietist = true;
    } else {
      this.dietist = false;
    }
  }

}