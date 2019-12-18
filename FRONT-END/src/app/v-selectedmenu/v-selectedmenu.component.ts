import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-v-selectedmenu',
  templateUrl: './v-selectedmenu.component.html',
  styleUrls: ['./v-selectedmenu.component.css']
})
export class VSelectedmenuComponent implements OnInit {

  //loading
  vista: string = "loading"
  details: string = 'none'

  ////////////MENU////////////

  getMenuSubscription: Subscription;
  gotMenu: object;
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

  //////////// DIETIST ///////////////
  dietist: boolean = false;

  //////////// DIETIST ///////////////
  paramID: Subscription;
  id: number;

  constructor(public _user: UserService,
    public _router: Router, public _path: ActivatedRoute) {

    this.detailsSubscription = this._user.userDetails.subscribe(
      (newValue) => {
        this.userDetails = newValue;
        this.userName = this.userDetails['data']['name'];
      }
    )

    this.paramID = this._path.params.subscribe((newValue) => {
      this.id = newValue.id;
      console.log(this.id)
      this._user.getSelectedMenu(this.id)

      this.getMenuSubscription = this._user.getMenuData.subscribe(
        (newValue) => {
          this.gotMenu = newValue
          this.menuData = this.gotMenu['data']

          this.starter_lunch = this.menuData['starterLunch']['name']
          this.main_lunch = this.menuData['mainLunch']['name']
          this.dessert_lunch = this.menuData['dessertLunch']['name']
          this.starter_dinner = this.menuData['starterDinner']['name']
          this.main_dinner = this.menuData['mainDinner']['name']
          this.dessert_dinner = this.menuData['dessertDinner']['name']
          console.log(this.menuData['starterLunch']['ingredients'])
        }
      )
    })



  }

  changeView() {
    setTimeout(() => {
      this.vista = "loggedIn"
    }, 2000);
  }

  showDetails(view, event){
    if(this.details == "none"){
      this.details = view
    }else if (this.details == view){
      this.details = "none"
    }
  }

  //// LOGOUT /////
  logout() {
    this._user.logout();
    this.vista = "loggedOut";setTimeout(() => {
      this._router.navigateByUrl("/home")
    }, 3000);
  }

  ngOnInit() {
    this._user.getDetails();;
    this.changeView();
    if (localStorage.getItem("dietist") == "true") {
      this.dietist = true;
    } else {
      this.dietist = false;
    }

  }
}
