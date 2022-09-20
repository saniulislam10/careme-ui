import { NzMessageService } from 'ng-zorro-antd/message';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {

  constructor(
    private userService: UserService, private router: Router,
    private msg: NzMessageService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isUser = this.userService.getUserStatus();
    if (!isUser) {
      this.msg.create('warning', 'please login first');
      this.router.navigate([environment.appBaseUrl]);
    }
    return isUser;
  }

}
