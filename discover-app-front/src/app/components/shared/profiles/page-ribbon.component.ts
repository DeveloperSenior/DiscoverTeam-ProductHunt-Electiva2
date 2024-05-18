import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PROFILE } from './../../../app.config';
import { environment } from './../../../../environments/environment';
import { ProfileService } from './profile.service';

@Component({
  selector: 'discover-page-ribbon',
  template: `
    <div class="ribbon" *ngIf="ribbonEnv" >
      <a href="">{{ ribbonEnv }}</a>
    </div>
  `,
  styleUrls: ['page-ribbon.scss'],
})
export class PageRibbonComponent implements OnInit {
  ribbonEnv$?: Observable<string | undefined>;

  ribbonEnv: any = (!environment.production || 'test' == PROFILE) ? PROFILE: undefined ;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.ribbonEnv$ = this.profileService.getProfileInfo().pipe(map(profileInfo => profileInfo.ribbonEnv)) ;
  }
}
