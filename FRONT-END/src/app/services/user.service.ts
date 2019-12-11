import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  ///// REGISTER /////
  registerData: Subject<object> = new Subject<object>();

  ///// LOGIN /////
  loginData: Subject<object> = new Subject<object>();
  logged: string;

  //// DETAILS ////
  //// POST ////
  detailsData: Subject<object> = new Subject<object>();
  //// GET ////
  userDetails: Subject<object> = new Subject<object>();
  details: object;

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



          } else {
            localStorage.setItem("logged", "false")
          }

        })
  }

  /////////////// POST USERDETAILS ///////////////

  putData(weight: number, height: number, age: number, gender: string, IMC: number, reqBasal: number): any {
    this._http.put("http://localhost:3000/update-details",
      { "weight": weight, "height": height, "age": age, "gender": gender, "IMC": IMC, "basal": reqBasal },
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
      reqBasal = (10 * weight) + (6.25 * height * 100) - (5 * age) - 161
    } else {
      reqBasal = (10 * weight) + (6.25 * height * 100) - (5 * age) + 5
    }
    console.log({ "IMC": IMC, "Basal": reqBasal, "Gender": gender })

    this.putData(weight, height, age, gender, IMC, reqBasal)

  }

  logout() {
    localStorage.removeItem("logged");
    setTimeout(() => {
      this._router.navigateByUrl("/home")
    }, 3000);
  }


}
