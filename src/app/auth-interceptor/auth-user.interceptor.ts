import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {UserService} from '../services/user.service';

@Injectable()
export class AuthUserInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.userService.getUserToken();

    if (authToken) {
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken),
        // headers: req.headers.set('Authorization', authToken.toString())
      });
      return next.handle(authRequest);
    } else {
      const authRequest = req.clone();
      return next.handle(authRequest);
    }

  }
}
