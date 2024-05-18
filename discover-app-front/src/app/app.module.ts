import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './base/icons/font-awesome-icons';
import { DatePipe, registerLocaleData } from '@angular/common';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import locale from '@angular/common/locales/es-CO';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app.routing.module';
import { HeaderComponent } from './components/shared/header/header.component';
import { RouterModule } from '@angular/router';
import { PageRibbonComponent } from './components/shared/profiles/page-ribbon.component';
import { Paginator } from './components/shared/paginator/component.paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AppInterceptor } from './base/interceptors/app-interceptor';
import { BlockTemplate } from './components/shared/block-ui/blockui-template';
import { LoginModalComponent } from './components/auth/modals/login.modal.component';
import { CommentsDetailModalComponent } from './components/user/modals/comments-detail.modal.component';
import { FollowersModalComponent } from './components/user/modals/followers.modal.component';
import { FiltersModalComponent } from './components/home/modals/filters.modal.component';
import { DetailProductModalComponent } from './components/product/modals/detail-product.modal.component';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [AppComponent, HeaderComponent, LoginModalComponent, PageRibbonComponent, BlockTemplate,CommentsDetailModalComponent, FollowersModalComponent,FiltersModalComponent, DetailProductModalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      },
  }),
    BlockUIModule.forRoot({
      template: BlockTemplate
  }),
  ],
  providers:[
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'es-co' },
    { provide: MatPaginatorIntl, useClass: Paginator },
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(iconLibrary: FaIconLibrary){
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
  }
}
