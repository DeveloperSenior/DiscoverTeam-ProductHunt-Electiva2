import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { minidenticon } from 'minidenticons'


import { VERSION } from './../../../app.config';


import { Subject } from 'rxjs';
import { LoginModalComponent } from '../../auth/modals/login.modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'discover-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.css'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  userSession?: any;
  version: string;
  loginDisplay = false;
  isNavbarCollapsed = true;
  private readonly _destroying$ = new Subject<void>();

  name?: string;
  email?: string;

  loginModalRef: MdbModalRef<LoginModalComponent> | null = null;


  constructor(private router: Router, public translate: TranslateService,
    private modalService: MdbModalService, public userService: UserService,
  ) {
    this.version = VERSION ? (VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION) : '';

  }

  ngOnInit(): void {
    this.setLoginDisplay();
  }

  ngAfterViewInit() { }

  openModal(tab: number) {
    this.loginModalRef = this.modalService.open(LoginModalComponent, {
      data: { tabActivate: tab },
    });
  }

  logout() {
    this.userService.logout().then(res => {
      window.location.reload();
    });
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  isAuthenticated(): boolean {
    return this.loginDisplay;
  }

  setLoginDisplay() {
    this.userSession = {
      email: localStorage.getItem('xa-user'),
      secureToken: localStorage.getItem('xa-token')
    };
    this.loginDisplay = this.userSession.email != undefined && this.userSession.email != null && this.userSession.email.length > 0;
  }

  getImage(name: string): string {
    let image = 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(name, 50, 95))
    return image;
  }

}
