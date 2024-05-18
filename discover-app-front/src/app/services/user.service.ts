import { Injectable } from "@angular/core";
import { ServiceBase } from "../base/services/base.service";
import { HttpClient } from "@angular/common/http";
import * as _jsonUser from '../components/user/constants/user.json';


@Injectable({ providedIn: 'root' })
export class UserService extends ServiceBase{

  contextService: string = "";

  constructor(public override http: HttpClient) {
      super(http)
  }

  login(payload: any){
    const {User} =  _jsonUser  as any;
    this.contextService = `${User.context}${User.services.login}`;
    return this.post(this.contextService, payload);
  }

  signup(payload: any){
    const {User} =  _jsonUser  as any;
    this.contextService = `${User.context}${User.services.signup}`;
    return this.put(this.contextService, payload);
  }

  getUser(email: any){
    const {User} =  _jsonUser  as any;
    if (email){
      this.contextService = `${User.context}${User.services.user}/${email}`;
    }else{
      this.contextService = `${User.context}${User.services.user}`;
    }
    return this.get(this.contextService);
  }

  follow(_idUserFollow: string){
    const {User} =  _jsonUser  as any;
    this.contextService = `${User.context}${User.services.follow}/${_idUserFollow}`;
    return this.patch(this.contextService);
  }

  unFollow(_idUserUnFollow: string){
    const {User} =  _jsonUser  as any;
    this.contextService = `${User.context}${User.services.unfollow}/${_idUserUnFollow}`;
    return this.patch(this.contextService);
  }

  logout() {
    localStorage.clear();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("ok");
      }, 300);
    });
  }

}
