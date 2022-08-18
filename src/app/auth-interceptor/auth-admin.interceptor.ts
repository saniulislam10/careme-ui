import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdminService} from '../services/admin.service';

@Injectable()
export class AuthAdminInterceptor implements HttpInterceptor {

  constructor(private adminService: AdminService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.adminService.getAdminToken();
    // console.log("Auth token",authToken);

    if (authToken) {
      const authRequest = req.clone({
        headers: req.headers.set('Administrator', 'Bearer ' + authToken)
        // headers: req.headers.set('Authorization', authToken.toString())
      });
      return next.handle(authRequest);
    } else {
      const authRequest = req.clone();
      return next.handle(authRequest);
    }

  }
}
