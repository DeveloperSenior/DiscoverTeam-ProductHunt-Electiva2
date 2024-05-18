import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ComponentBase } from '../../../base/components/component.base';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { minidenticon } from 'minidenticons';


@Component({
  selector: 'app-comments-detail',
  templateUrl: './comments-detail.modal.component.html',
})
export class CommentsDetailModalComponent extends ComponentBase  implements OnInit,AfterViewInit{

  rating: number = 3;
  starCount: number = 5;
  color: string = 'accent';
  showMessage: boolean = true;
  clickDisabled: boolean = false;
  ratingArr: number[] = [];
  private snackBarDuration: number = 2000;

  user!: any;
  scopeList!: any[] | any[];
  dataSource = new MatTableDataSource(this.scopeList);
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('tableSort') tableSort!: MatSort;
  displayedColumns: string[] = ['name','comments'];

  constructor(public modalRef: MdbModalRef<CommentsDetailModalComponent>,
     public override translateService: TranslateService,
     private snackBar: MatSnackBar) {
    super(translateService);


  }
  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    this.dataSource = new MatTableDataSource<any>(this.scopeList);
    this.dataSource._updateChangeSubscription();
  }

  onClickStar(rating: number) {
    if (this.clickDisabled) {
      this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
        duration: this.snackBarDuration
      });
    }
    return false;
  }

  getStars(rating:number){
    this.rating = rating;
    return this.ratingArr;
  }

  showIconStar(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  validateAvatar(comment: any): string {
    const{user} = comment;
    return user.avatar != null ? user.avatar : this.getImage(user.userName);

  }

  getImage(name: string): string {
    let image = 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(name, 15, 25))
    return image;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.tableSort;
  }


}
