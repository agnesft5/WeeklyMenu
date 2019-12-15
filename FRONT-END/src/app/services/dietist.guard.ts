import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DietistGuard {

  logged: string;

  constructor(
    public _router: Router,
    public _user: UserService) {

  }

  canActivate() {

    if (localStorage.getItem("dietist") == "true") {
      return true;
    } else {
      this._router.navigateByUrl("/details")
      return false;

    }

  }


}
