import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ComponentBase } from '../../../base/components/component.base';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { minidenticon } from 'minidenticons';
import { CommentsDetailModalComponent } from '../../user/modals/comments-detail.modal.component';
import { ProductService } from '../../../services/product.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.modal.component.html',
})
export class DetailProductModalComponent extends ComponentBase  implements OnInit,AfterViewInit{

  rating: number = 3;
  ratingComment: number = 0;
  starCount: number = 5;
  color: string = 'accent';
  showMessage: boolean = true;
  clickDisabled: boolean = false;
  ratingArr: number[] = [];
  ratingCommentArr: number[] = [];
  private snackBarDuration: number = 2000;

  user!: any;
  product!: any;
  commentsModalRef: MdbModalRef<CommentsDetailModalComponent> | null = null;

  form!: FormGroup;

  constructor(public modalRef: MdbModalRef<DetailProductModalComponent>,
     public override translateService: TranslateService,
     private modalService: MdbModalService,
     private productService: ProductService,
     private snackBar: MatSnackBar,
     private fb: FormBuilder,) {
    super(translateService);


  }
  ngOnInit(): void {
    this.user = {
      email: localStorage.getItem('xa-user')
    }
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    for (let index = 0; index < this.starCount; index++) {
      this.ratingCommentArr.push(index);
    }
    this.form = this.fb.group({
      comment: new FormControl({ value: null, disabled: false }, [Validators.minLength(10), Validators.maxLength(150)]),
      rate: new FormControl({ value: 1, disabled: false }, [Validators.minLength(1), Validators.maxLength(5)]),
    });
    this.form.reset();
  }

  onClickStar(rating: number) {
    if (this.clickDisabled) {
      this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
        duration: this.snackBarDuration
      });
    }
    return false;
  }

  onClickStarComment(rating: number) {
    if (this.clickDisabled) {
      this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
        duration: this.snackBarDuration
      });
    }
    this.ratingComment = rating;
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

  showIconStarComment(index: number) {
    if (this.ratingComment >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  validateAvatar(): string {
    return  this.getImage(this.product.name);

  }

  getImage(name: string): string {
    let image = 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(name, 15, 25))
    return image;
  }

  getDetailProduct(_idProduct: string) {
    this.productService.queryDetailProduct(_idProduct).subscribe((response: any) => {
      const { product, commentsRating } = response.body;
      product.totalComments = commentsRating.length;
      product.commentsRating = commentsRating;
      this.product = product;
    });
  }

  showComments(product: any) {
    console.log(product);

    this.commentsModalRef = this.modalService.open(CommentsDetailModalComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
      data: {
        user: this.user,
        scopeList: product.commentsRating
      },
    });
  }

  get validateForm() {
    return (this.form.get('comment')?.valid);
  }

  comment(){
    const comment = this.form.getRawValue();
    comment.rate = this.ratingComment;
    console.log(comment);
    this.productService.commentsProduct(comment,this.product._id).subscribe((response) =>{
      console.log(response.body);
      this.form.reset();
      this.ratingComment = 0;
      this.getDetailProduct(this.product._id);
    });
  }

  ngAfterViewInit(): void {
    this.getDetailProduct(this.product._id);
  }


}
