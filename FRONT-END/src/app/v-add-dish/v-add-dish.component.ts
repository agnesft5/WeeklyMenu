import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule, FormControl, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-v-add-dish',
  templateUrl: './v-add-dish.component.html',
  styleUrls: ['./v-add-dish.component.css']
})
export class VAddDishComponent {

  //////// FORM ////////
  name: string;
  ingredient: string;
  quantity: number;
  kcal: number;
  dessertTrue: boolean = false;

  ////// GENERATED ARRAYS ///////
  ingredients: string[] = [];
  quantities: number[] = [];

  ///// VIEWS ////////
  inputError: boolean = false;
  showArrays: string = 'dontShow';
  dietist: boolean = false;
  vista: string = "loggedIn";
  postLoading: boolean = false;
  showStatus: string = 'noStatus';

  //ingredientes: string[] = ['patata', 'ceba', 'all']

  /////// SUBSCRIPTION DISH //////
  postedDishSubscription: Subscription;
  postedData: object;
  status: string;


  /////// SUBSCRIPTION USER //////
  detailsSubscription: Subscription;
  userDetails: object;
  userName: string;

  constructor(public _user: UserService, public _router:Router) {
    this.postedDishSubscription = this._user.postDishData.subscribe(
      (newValue) => {
        this.postedData = newValue
        this.postLoading = true;
        this.status = this.postedData['status']
        if (this.status !== undefined) {
          setTimeout(() => {
            this.postLoading = false;
            this.showStatus = 'status';
            setTimeout(() => {
              if(this.status === "Dish saved!"){
                this.showStatus = 'postAnother'
              }else{
                this.showStatus = 'tryAgain'
              }
            }, 3000);
          }, 5000);
        }
        setTimeout(() => {
          this.status = this.postedData['status']
          console.log(this.status)
          this.postLoading = false;
        }, 5000);

        console.log(this.postedData)
      }
    )

    this.detailsSubscription = this._user.userDetails.subscribe(
      (newValue) => {
        this.userDetails = newValue;
        this.userName = this.userDetails['data']['name'];
      }
    )
  }



  //// PRINT INGREDIENTS & QUANTITIES ////
  printData() {
    if (this.ingredients.length > 0 && this.quantities.length > 0) {
      console.log(this.ingredients.length, this.quantities.length)
      this.showArrays = 'show'
    } else {
      this.showArrays = 'dontShow';
    }

  }

  //// ADD INGREDIENTS & QUANTITIES ////

  addData(inputIngredient, inputQuantity) {
    if (inputIngredient.value == "" || inputIngredient.value == undefined || inputIngredient.value == null && inputQuantity == "" || inputQuantity.value == undefined || inputQuantity.value == null) {
      this.inputError = true;
      console.log(this.inputError)
    } else {
      this.ingredients.push(inputIngredient.value);
      this.quantities.push(inputQuantity.value);
      console.log(this.ingredients);
      console.log(this.quantities);
      this.inputError = false;
      inputIngredient.reset()
      inputQuantity.reset();
      this.printData();
    }
  }


  //// EMPTY ARRAYS ////
  eraseContent() {
    this.ingredients = [];
    this.quantities = [];
    console.log(this.ingredients);
    console.log(this.quantities);
  }

  /////// SEND DATA //////
  sendData(form: NgForm): any {
    if (this.name !== undefined && this.ingredients.length > 0 && this.quantities.length > 0 && this.kcal !== undefined) {
      if (this.dessertTrue == undefined || this.dessertTrue == null) {
        this.dessertTrue = false
        this._user.calculateDish(this.name, this.ingredients, this.quantities, this.kcal, this.dessertTrue)
        this.ingredients = [];
        this.quantities = [];
        this.showArrays = 'dontShow'
      } else {
        this._user.calculateDish(this.name, this.ingredients, this.quantities, this.kcal, this.dessertTrue)
        this.ingredients = [];
        this.quantities = [];
        this.showArrays = 'dontShow'
      }
    } else {
      return false
    }
  }

  /////// ERASE INGREDIENT /////
  eraseIngredient(index) {
    this.ingredients.splice(index, 1)
    this.quantities.splice(index, 1)
  }

  /////// POST AGAIN /////
  postAgain() {
    this.showStatus = 'noStatus'
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
    if (localStorage.getItem("dietist") == "true") {
      this.dietist = true;
    } else {
      this.dietist = false;
    }
  }

}
