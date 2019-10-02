import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Injectable({
  providedIn: 'root'
})
export class PlannerRouteGaurdService  {

  constructor(private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
console.log("working dude")

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      this.router.navigate(['/login']);

      return false;

    } else {

      return true;

    }

  }
}
