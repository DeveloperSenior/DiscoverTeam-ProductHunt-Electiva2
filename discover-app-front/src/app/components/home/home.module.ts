import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StarRatingComponent } from '../shared/rating/star-rating.component';


@NgModule({
  declarations: [HomeComponent, StarRatingComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
