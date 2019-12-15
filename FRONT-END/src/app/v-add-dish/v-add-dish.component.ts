import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

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
  postLoading: boolean = true;

  //ingredientes: string[] = ['patata', 'ceba', 'all']

  /////// SUBSCRIPTION //////
  postedDishSubscription: Subscription;
  postedData: object;
  status: string;



  constructor(public _user: UserService) {
    this.postedDishSubscription = this._user.postDishData.subscribe(
      (newValue) => {
        this.postedData = newValue
        this.postLoading = true;
        setTimeout(() => {
          this.status = this.postedData['status']
          console.log(this.status)
          this.postLoading = false;
        }, 5000);
        
        console.log(this.postedData)
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

  addData(ingredient, quantity) {
    if (ingredient == "" || ingredient == undefined || ingredient == null && quantity == "" || quantity == undefined || quantity == null) {
      this.inputError = true;
      console.log(this.inputError)
    } else {
      this.ingredients.push(ingredient);
      this.quantities.push(quantity);
      console.log(this.ingredients);
      console.log(this.quantities);
      this.inputError = false;
      this.ingredient = undefined;
      this.quantity = undefined;
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
  sendData(form: FormControl): any {
    if (this.name !== undefined && this.ingredients.length > 0 && this.quantities.length > 0 && this.kcal !== undefined) {
      if (this.dessertTrue == undefined || this.dessertTrue == null) {
        this.dessertTrue = false
        this._user.calculateDish(this.name, this.ingredients, this.quantities, this.kcal, this.dessertTrue)
      } else {
        this._user.calculateDish(this.name, this.ingredients, this.quantities, this.kcal, this.dessertTrue)
      }
    } else {
      return false
    }
  }

  //// LOGOUT /////

  logout() {
    this._user.logout();
    this.vista = "loggedOut";
  }

  ngOnInit() {
    if (localStorage.getItem("dietist") == "true") {
      this.dietist = true;
    } else {
      this.dietist = false;
    }
  }

}
