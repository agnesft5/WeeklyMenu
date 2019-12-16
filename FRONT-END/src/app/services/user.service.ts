import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  objProf: object = {
    profile_1200: [
      { meal: "starter_lunch", range: [202, 207], dessert: false },
      { meal: "main_lunch", range: [126, 130], dessert: false },
      { meal: "dessert_lunch", range: [90, 94], dessert: true },
      { meal: "starter_dinner", range: [114, 119], dessert: false },
      { meal: "main_dinner", range: [71, 75], dessert: false },
      { meal: "dessert_dinner", range: [44, 50], dessert: true }
    ],
    profile_1400: [
      { meal: "starter_lunch", range: [240, 261], dessert: false },
      { meal: "main_lunch", range: [143, 147], dessert: false },
      { meal: "dessert_lunch", range: [101, 106], dessert: true },
      { meal: "starter_dinner", range: [137, 142], dessert: false },
      { meal: "main_dinner", range: [83, 89], dessert: false },
      { meal: "dessert_dinner", range: [51, 55], dessert: true }
    ],
    profile_1600: [
      { meal: "starter_lunch", range: [262, 285], dessert: false },
      { meal: "main_lunch", range: [163, 173], dessert: false },
      { meal: "dessert_lunch", range: [107, 113], dessert: true },
      { meal: "starter_dinner", range: [155, 162], dessert: false },
      { meal: "main_dinner", range: [95, 100], dessert: false },
      { meal: "dessert_dinner", range: [61, 65], dessert: true }
    ],
    profile_1800: [
      { meal: "starter_lunch", range: [286, 320], dessert: false },
      { meal: "main_lunch", range: [190, 194], dessert: false },
      { meal: "dessert_lunch", range: [131, 136], dessert: true },
      { meal: "starter_dinner", range: [226, 230], dessert: false },
      { meal: "main_dinner", range: [56, 60], dessert: false },
      { meal: "dessert_dinner", range: [66, 70], dessert: true }
    ],
    profile_2000: [
      { meal: "starter_lunch", range: [321, 355], dessert: false },
      { meal: "main_lunch", range: [208, 215], dessert: false },
      { meal: "dessert_lunch", range: [148, 154], dessert: true },
      { meal: "starter_dinner", range: [195, 201], dessert: false },
      { meal: "main_dinner", range: [120, 125], dessert: false },
      { meal: "dessert_dinner", range: [76, 82], dessert: true }
    ], profile_2200: [
      { meal: "starter_lunch", range: [356, 390], dessert: false },
      { meal: "main_lunch", range: [231, 239], dessert: false },
      { meal: "dessert_lunch", range: [174, 184], dessert: true },
      { meal: "starter_dinner", range: [216, 225], dessert: false },
      { meal: "main_dinner", range: [185, 189], dessert: false },
      { meal: "dessert_dinner", range: [15, 43], dessert: true }
    ]

  }

  //////////////// REGISTER /////////////
  registerData: Subject<object> = new Subject<object>();

  //////////////// LOGIN /////////////
  loginData: Subject<object> = new Subject<object>();
  logged: string;

  //////////// DETAILS /////////////
  //// POST ////
  detailsData: Subject<object> = new Subject<object>();
  //// GET ////
  userDetails: Subject<object> = new Subject<object>();
  details: object;

  //////////// MENU /////////////
  //// POST ////
  postMenuData: Subject<object> = new Subject<object>();

  //////////// MENU /////////////
  //// POST ////
  postDietData: Subject<object> = new Subject<object>();
  dietData:Subject<object> = new Subject<object>();
  diet:object;

  //////////// DISH /////////////
  //// POST ////
  postDishData: Subject<object> = new Subject<object>();
  postedDish: object;


  constructor(
    public _http: HttpClient,
    public _router: Router
  ) { }

  ////////////////// POST REGISTER //////////////////

  register(name: string, lastName: string, username: string, email: string, password: string, dietistTrue: string): any {
    this._http.post(
      "http://localhost:3000/register",
      { "name": name, "lastName": lastName, "username": username, "email": email, "password": password, "dietist": dietistTrue },
      { headers: new HttpHeaders({ "x-requested-witdh": "XMLHResponse" }) })
      .subscribe(
        (result) => {
          this.registerData.next(result)
        })
  }

  /////////////// GET USERDETAILS ///////////////
  getDetails(): void {
    this._http.get("http://localhost:3000/user-details",
      { headers: new HttpHeaders({ "x-requested-witdh": "XMLHResponse" }) })
      .subscribe(
        (result) => {
          this.userDetails.next(result);
          this.details = result;
        }
      )
  }

  ////////////////// POST LOGIN //////////////////

  login(username: string, password: string): any {
    this._http.post("http://localhost:3000/login",
      { "username": username, "password": password },
      { headers: new HttpHeaders({ "x-requested-witdh": "XMLHResponse" }) })
      .subscribe(
        (result) => {
          this.loginData.next(result);
          this.logged = result["status"];
          if (this.logged === "You are logged!") {

            localStorage.setItem("logged", "true");

            this.getDetails()
            setTimeout(() => {
              if (this.details["data"]["weight"] !== undefined) {
                localStorage.setItem("detailed", "true")
              } else {
                localStorage.setItem("detailed", "false")
              }

            }, 3000);
            setTimeout(() => {
              if (this.details['data']['dietist'] === true) {
                console.log(this.details['data']['dietist'])
                localStorage.setItem("dietist", "true")
              } else {
                localStorage.setItem("dietist", "false")
              }
            }, 3000);



          } else {
            localStorage.setItem("logged", "false")
          }

        })
  }

  /////////////// POST USERDETAILS ///////////////

  putData(weight: number, height: number, age: number, gender: string, IMC: number, reqBasal: number, profile: string): any {
    this._http.put("http://localhost:3000/update-details",
      { "weight": weight, "height": height, "age": age, "gender": gender, "IMC": IMC, "basal": reqBasal, "userProfile": profile },
      { headers: new HttpHeaders({ "x-requested-witdh": "XMLHResponse" }) })
      .subscribe(
        (result) => {
          this.detailsData.next(result);
        })
  }



  //////////// CALCULATE USER DETAILS ////////////

  calculate(weight: number, height: number, age: number, gender: string): any {

    let IMC: number = Math.round(weight / (height * height));

    let reqBasal: number;

    if (gender == "F") {
      reqBasal = Math.round((10 * weight) + (6.25 * height * 100) - (5 * age) - 161)
    } else {
      reqBasal = Math.round((10 * weight) + (6.25 * height * 100) - (5 * age) + 5)
    }

    //PROFILE
    let userProfile: string;

    if (reqBasal <= 1300) {
      userProfile = "profile_1200"
    } else if (reqBasal >= 1301 && reqBasal <= 1500) {
      userProfile = "profile_1400"
    } else if (reqBasal >= 1501 && reqBasal <= 1700) {
      userProfile = "profile_1600"
    } else if (reqBasal >= 1701 && reqBasal <= 1900) {
      userProfile = "profile_1800"
    } else if (reqBasal >= 1901 && reqBasal <= 2100) {
      userProfile = "profile_2000"
    } else if (reqBasal >= 2101) {
      userProfile = "profile_2200"
    } else {
      userProfile = "Undefined profile"
    }

    this.putData(weight, height, age, gender, IMC, reqBasal, userProfile)

  }

  /////////////// GET DIET ///////////////
  getDiet(id): void {
    this._http.get(`http://localhost:3000/get-diet/${id}`,
      { headers: new HttpHeaders({ "x-requested-witdh": "XMLHResponse" }) })
      .subscribe(
        (result) => {
          this.dietData.next(result);
          this.diet = result;
        }
      )
  }

  /////////////// GENERATE MENU ///////////////

  createMenu(): any {
    this._http.post("http://localhost:3000/generate-menu",
      { headers: new HttpHeaders({ "x-requested-witdh": "XMLHResponse" }) })
      .subscribe(
        (result) => {
          this.postMenuData.next(result);
        })
  }

  /////////////// POST DISH ///////////////
  postDish(name: string, ingredients: string[], quantity: number[], kcal: number, type: string, profile: string): any {
    this._http.post("http://localhost:3000/add-dish",
      { "name": name, "ingredients": ingredients, "quantity": quantity, "kcal": kcal, "type": type, "profile": profile },
      { headers: new HttpHeaders({ "x-requested-witdh": "XMLHResponse" }) })
      .subscribe(
        (result) => {
          this.postDishData.next(result);
          this.postedDish = result
          // console.log(this.postDish)
          // console.log(this.postedDish)
        })
  }

  /////////////// CALCULATE DISH PROFILE AND TYPE ///////////////
  calculateDish(name: string, ingredients: string[], quantity: number[], kcal: number, isDessert: boolean): any {
    //CALCULAR PERFIL I TIPO

    let type: string;
    let profile: string;
    let profileFound: boolean = false;

    for (let i = 0; i < Object.keys(this.objProf).length; i++) {
      let profileKey = Object.keys(this.objProf)[i]
      let arrProf = this.objProf[profileKey]


      for (let j = 0; j < arrProf.length; j++) {
        let meal = arrProf[j].meal;
        let dessert = arrProf[j].dessert
        let arrRange = arrProf[j].range;
        let inferior = arrRange[0];
        let superior = arrRange[1];

        console.log(isDessert)


        if (kcal >= inferior && kcal <= superior && dessert === isDessert) {
          profile = profileKey;
          type = meal;
          profileFound = true;

        } else if (kcal >= 391 && isDessert === false) {

          profile = "profile_2200";
          type = "starter_lunch";
          profileFound = true;

        } else if (kcal <= 14 && isDessert === true) {
          profile = "profile_1200";
          type = "dessert_dinner";
          profileFound = true;

        }

      }

    }

    console.log(type)
    console.log(profile)

    if (!profileFound) {
      profile = "profile_undefined";
      type = "meal_undefined";
    }

    this.postDish(name, ingredients, quantity, kcal, type, profile)
  }


  /////////////// GENERATE DIET ///////////////

  createDiet(): any {
    this._http.post("http://localhost:3000/generate-diet",
      { headers: new HttpHeaders({ "x-requested-witdh": "XMLHResponse" }) })
      .subscribe(
        (result) => {
          this.postDietData.next(result);
        })
  }

  logout() {
    localStorage.removeItem("logged");
    localStorage.removeItem("dietist");
    setTimeout(() => {
      this._router.navigateByUrl("/home")
    }, 3000);
  }


}
