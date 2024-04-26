import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor (
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = localStorage.getItem('token');
        if (token) {
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}