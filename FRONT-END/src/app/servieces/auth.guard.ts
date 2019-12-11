import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  logged: string;

  constructor(
    public _router: Router,
    public _user: UserService) {

  }

  canActivate() {

    if (localStorage.getItem("logged") == "true") {
      console.log(localStorage.getItem("logged"))
      return true;
    } else {
      console.log(localStorage.getItem("logged"))
      this._router.navigateByUrl("/login")
      return false;

    }

  }


}
