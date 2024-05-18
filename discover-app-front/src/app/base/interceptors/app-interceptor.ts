import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class AppInterceptor implements HttpInterceptor {
  userSession?: any;
  private countRequest = 0;
  @BlockUI() blockUI!: NgBlockUI;
  constructor(private traslate: TranslateService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.countRequest) {
      this.blockUI.start();
    }
    this.countRequest++;

    this.userSession = {
      email: localStorage.getItem('xa-user'),
      secureToken: localStorage.getItem('xa-token')
    };
    const token = (this.userSession == null
      || this.userSession === undefined
      || this.userSession === '*' ? '*' : this.userSession.secureToken);
    const headers = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next.handle(headers).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          console.log('This is client side error');
          errorMsg = `<b>Error:</b> ${error.error.message}`;
        } else {
          console.log('This is server side error');
          errorMsg = `<b>Error Code:</b> ${error.status},  <b>Message</b>: ${error.message}`;
        }
        console.log(errorMsg);
        Swal.fire('Oops!', this.traslate.instant("generic.messages.generic_error") + "<br><br>" + errorMsg, 'error');
        return throwError(errorMsg);
      }),
      map((res: any) => {
        let errorMsg = '';
        if (res?.body?.message && res?.body?.code !== 0) {
          console.log("Back response", res);
          errorMsg = `<b>Warning Code:</b> ${res?.body?.code},  <b>Message</b>: ${res?.body?.message}`;
          Swal.fire(this.traslate.instant("generic.titles.warning"), this.traslate.instant("generic.messages.generic_error_back") + "<br><br>" + errorMsg, 'warning');
          return throwError(errorMsg);
        }
        return res
      }),
      finalize(() => {
        this.countRequest--;
        if (!this.countRequest) {
          this.blockUI.stop();
        }
      })
    );
  }
}
