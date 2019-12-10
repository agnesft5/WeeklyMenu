import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  registerData: Subject<object> = new Subject<object>();
  loginData: Subject<object> = new Subject<object>();

  constructor(
    public _http: HttpClient,
    public _router: Router
  ) { }


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

  login(username: string, password: string): any {
    this._http.post("http://localhost:3000/login",
      { "username": username, "password": password },
      { headers: new HttpHeaders({ "x-requested-witdh": "XMLHResponse" }) })
      .subscribe(
        (result) => {
          this.loginData.next(result);
        })
  }
}
