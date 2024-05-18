import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';


/**
 * @author Andres Escobar
 */
@Injectable({
  providedIn: 'root',
})
export class ServiceBase {
  json: any;
  constructor(public http: HttpClient) {}

  private getContext(urlEndPoint: string, endpointPort?: number, security?: boolean): string {
    let context: string = urlEndPoint;
    if (!environment.proxy) {
      if (environment.production) {
        context =
          (security ? environment.urlBaseSecurity  : environment.urlBase ) +
          urlEndPoint;
      } else {
        context = (security ? environment.urlBaseSecurity : environment.urlBase ) + urlEndPoint;
      }
    }
    return context;
  }

  get(urlEndPoint: string, endpointPort?: number): Observable<any> {
    return this.http.get(this.getContext(urlEndPoint, endpointPort), { observe: 'response' });
  }

  post(urlEndPoint: string, body: any, endpointPort?: number, security?: boolean): Observable<any> {
    return this.http.post(this.getContext(urlEndPoint, endpointPort, security), body, { observe: 'response' });
  }

  put(urlEndPoint: string, body: any, endpointPort?: number): Observable<any> {
    return this.http.put(this.getContext(urlEndPoint, endpointPort), body, { observe: 'response' });
  }

  patch(urlEndPoint: string, body?: any, endpointPort?: number): Observable<any> {
    return this.http.patch(this.getContext(urlEndPoint, endpointPort), body , { observe: 'response' });
  }

  delete(urlEndPoint: string, body?: any, endpointPort?: number): Observable<any> {
    return this.http.delete(this.getContext(urlEndPoint, endpointPort), {body: body, observe: 'response'});
  }

  download(urlEndPoint: string, fileName: string, endpointPort?: number): Observable<any> {
    return this.http.get(this.getContext(urlEndPoint, endpointPort), { responseType: 'arraybuffer', observe: 'response' });
  }

}

export interface ICrudBase {
  save(t: any): Observable<any>;
  update(t: any): Observable<any>;
  find(t: any): Observable<any>;
  delete(t: any): Observable<any>;
}
