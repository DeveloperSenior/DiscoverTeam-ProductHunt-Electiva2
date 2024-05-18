import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit {

  @Input('rating') rating: number = 3;
  @Input('starCount') starCount: number = 5;
  @Input('color') color: string = 'accent';
  @Input('showMessage') showMessage: boolean = true;
  @Input('clickDisabled') clickDisabled: boolean = false;

  @Output() ratingUpdated = new EventEmitter();

  private snackBarDuration: number = 2000;
  ratingArr: number[] = [];

  constructor(private snackBar: MatSnackBar) {
  }


  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
  onClick(rating: number) {
    if (this.clickDisabled) {
      this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
        duration: this.snackBarDuration
      });
      this.ratingUpdated.emit(rating);
    }
    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}
