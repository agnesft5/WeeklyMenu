import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-v-single-menu',
  templateUrl: './v-single-menu.component.html',
  styleUrls: ['./v-single-menu.component.css']
})
export class VSingleMenuComponent implements OnInit {

  //loading
  vista: string = "loading"
  details:string = 'none'

  ////////////MENU////////////

  postSubscription: Subscription;
  postMenuData: object;
  menuData: object;

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



  constructor(
    public _user: UserService,
    public _router: Router
  ) {

    this.postSubscription = this._user.postMenuData.subscribe(
      (newValue) => {
        this.postMenuData = newValue
        this.menuData = this.postMenuData['data']
        this.starter_lunch = this.menuData['starterLunch']['name']
        this.main_lunch = this.menuData['mainLunch']['name']
        this.dessert_lunch = this.menuData['dessertLunch']['name']
        this.starter_dinner = this.menuData['starterDinner']['name']
        this.main_dinner = this.menuData['mainDinner']['name']
        this.dessert_dinner = this.menuData['dessertDinner']['name']
        console.log(this.menuData['starterLunch']['ingredients'])
      }
    )

    this.detailsSubscription = this._user.userDetails.subscribe(
      (newValue) => {
        this.userDetails = newValue;
        this.userName = this.userDetails['data']['name'];
      }
    )

  }

  changeView(){
    setTimeout(() => {
      this.vista = "loggedIn"
    }, 3000);
  }

  showDetails(view, event){
    this.details = view
    if(event.detail == 2){
      this.details = "none"
    }
    // setTimeout(() => {
    //   this.details = 'none'
    // }, 3000);
  }


  //// LOGOUT /////

  logout() {
    this._user.logout();
    this.vista = "loggedOut";
  }

  ngOnInit() {
    this._user.createMenu();
    this._user.getDetails();
    this.changeView();
  }

}
