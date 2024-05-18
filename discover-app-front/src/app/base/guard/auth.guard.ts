import { inject, Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import Swal, { SweetAlertIcon } from 'sweetalert2'

@Injectable({
  providedIn: 'root',
})
class UserToken {
  email!: string;
}

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  canActivate(currentUser: UserToken, token: string,route: ActivatedRouteSnapshot,state: RouterStateSnapshot ): boolean {
    const router = inject(Router);
    const translate = inject(TranslateService);
    if (token){
      return true;
    }
    Swal.fire('Acceso denegado', 'Ingrese al sistema para poder ver está opción');
    router.navigate(['home'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  canMatch(currentUser: UserToken): boolean {
    return true;
  }
}

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const token = localStorage.getItem('xa-token') || '';
  const user = inject(UserToken);
  user.email = localStorage.getItem('xa-user') || '';
  return inject(PermissionsService).canActivate(
    inject(UserToken),token,route,state
  );
};
