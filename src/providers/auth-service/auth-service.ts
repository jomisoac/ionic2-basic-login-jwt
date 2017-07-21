import { Injectable } from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
import {Response, Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  private api = 'http://localhost:1337';

  constructor(public http:Http, public authHttp:AuthHttp,) {}

  getUser(user_login, user_password):Observable<any> {
    let body = "username=" + user_login + "&password=" + user_password;

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({headers: headers});

    return this.http.post(`${this.api}/user/authentication`, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSecuredData():any {
    let jwt = localStorage.getItem('id_token');
    let authHeader = new Headers();

    if (jwt) {
      authHeader.append('Authorization', jwt);
    }

    let options = new RequestOptions({headers: authHeader});

    return this.http.get(`${this.api}/restricted`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res:Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error:any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
