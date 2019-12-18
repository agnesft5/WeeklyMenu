import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-v-dietistdishes',
  templateUrl: './v-dietistdishes.component.html',
  styleUrls: ['./v-dietistdishes.component.css']
})
export class VDietistdishesComponent implements OnInit {


  //////////// VIEWS ////////////
  vista: string = 'loading'
  dietist: boolean;
  postLoading: boolean = false;
  showStatus: string = 'noStatus';
  loadedData: boolean = false;

  //////////// USER DETAILS////////////
  detailsSubscription: Subscription;
  userDetails: object;
  userName: string;

  //////////// GET DISHES////////////
  getDishesData: Subscription;
  dietistDishes: object[];
  quantityOfDishes: number;

  //////////// DELETE DISH////////////
  deleteDishData: Subscription;
  deletedDish: object;
  status: string;

  constructor(public _user: UserService, public _router:Router) {

    this.detailsSubscription = this._user.userDetails.subscribe(
      (newValue) => {
        this.userDetails = newValue;
        this.userName = this.userDetails['data']['name'];
      }
    )


    this.getDishesData = this._user.dietistData.subscribe(
      (newValue:any) => {
        this.dietistDishes = newValue;
        this.quantityOfDishes = this.dietistDishes.length;
        if (this.quantityOfDishes > 0) {
          this.loadedData = true;
        } else {
          this.loadedData = false;
        }
      }
    )

    this.deleteDishData = this._user.deleteDishData.subscribe(
      (newValue) => {
        this.deletedDish = newValue;
        this.status = this.deletedDish['status'];
        if (this.status !== undefined) {
          this.postLoading = true;
          setTimeout(() => {
            this.showStatus = 'status';
            this.postLoading = false;
          }, 5000);
          setTimeout(() => {
            this.showStatus = 'false';
          }, 8000);
        } else {
          this.showStatus = 'noStatus'
        }
      }
    )
  }


  ///// CHANGE VIEW ////
  changeView() {
    setTimeout(() => {
      this.vista = "loggedIn"
    }, 5000);
  }

  deleteDish(id) {
    window.scrollTo(0,0)
    this._user.deleteDietistDish(id);
    setTimeout(() => {
      this._user.getDietistDishes();
    }, 8000); 
  }

  //// LOGOUT /////
  logout() {
    this._user.logout();
    this.vista = "loggedOut";
    setTimeout(() => {
      this._router.navigateByUrl("/home")
    }, 3000);
  }

  ngOnInit() {
    this._user.getDetails();
    this._user.getDietistDishes();
    this.changeView();
    if (localStorage.getItem("dietist") == "true") {
      this.dietist = true;
    } else {
      this.dietist = false;
    }
  }

}
