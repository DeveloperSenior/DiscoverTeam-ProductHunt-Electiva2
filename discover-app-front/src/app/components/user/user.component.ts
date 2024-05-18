import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../../services/product.service';
import { ComponentBase } from '../../base/components/component.base';
import { minidenticon } from 'minidenticons';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CommentsDetailModalComponent } from './modals/comments-detail.modal.component';
import { FollowersModalComponent } from './modals/followers.modal.component';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent extends ComponentBase implements OnInit, AfterViewInit {

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
  displayedColumns: string[] = ['name'];

  commentsModalRef: MdbModalRef<CommentsDetailModalComponent> | null = null;
  followersModalRef: MdbModalRef<FollowersModalComponent> | null = null;

  emailParam!: string;

  followUnfollow: string = 'Seguir';
  isFollow: boolean = false;

  constructor(public override translateService: TranslateService,
    private userService: UserService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private modalService: MdbModalService,
    private route: ActivatedRoute,) {
    super(translateService);

  }

  ngOnInit(): void {
    const { email } = this.route.snapshot.params;
    this.emailParam = email;

    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    this.user = {
      email: this.emailParam ? this.emailParam : localStorage.getItem('xa-user')
    }
    this.userService.getUser(this.user.email).subscribe((response: any) => {
      const { body } = response;
      const [profile] = body;
      this.user = profile;
      if (this.showFollowUnfollow()) {
        const { followins, followers } = this.user;

        const exists = followers?.filter((user: any) => user.email == localStorage.getItem('xa-user'));

        this.isFollow = exists && exists.length > 0;
        this.followUnfollow = this.isFollow ? 'Dejar de seguir' : 'Seguir';
      }

      this.scopeList = [];
      this.dataSource = new MatTableDataSource<any>(this.scopeList);
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.tableSort;
      this.getMyProducts();
    })
  }

  showFollowUnfollow() {
    return this.user.email !== localStorage.getItem('xa-user');
  }

  onUnfollowFollow(eventFollow: boolean) {

    console.log(eventFollow);
    if (eventFollow) {
      this.userService.follow(this.user._id).subscribe((response: any) => {
        this.ngOnInit();
      });
    } else {
      this.userService.unFollow(this.user._id).subscribe((response: any) => {
        this.ngOnInit();
      });
    }


  }


  onClickStar(rating: number) {
    if (this.clickDisabled) {
      this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
        duration: this.snackBarDuration
      });
    }
    return false;
  }

  getStars(rating: number) {
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

  getMyProducts() {
    this.productService.queryMyProducts(this.user._id).subscribe((response: any) => {
      console.log(response)
      let data = response.body;
      let error = response.body.message;
      if (!error) {
        if (data) {
          data.forEach((product: any) => {
            this.getDetailProduct(product._id);
          });

          setTimeout(() => {
            this.dataSource = new MatTableDataSource<any>(this.scopeList);
            this.dataSource._updateChangeSubscription();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.tableSort;
          }, 1000);

        }
      } else {
        this.showAlert(error);
      }
    })
  }

  getDetailProduct(_idProduct: string) {
    this.productService.queryDetailProduct(_idProduct).subscribe((response: any) => {
      const { product, commentsRating } = response.body;
      product.totalComments = commentsRating.length;
      product.commentsRating = commentsRating;
      console.log(commentsRating);
      this.scopeList.push(product);
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

  openFollowersModal(tab: number) {

    this.followersModalRef = this.modalService.open(FollowersModalComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
      data: {
        title: tab == 1 ? this.translateService.instant('pages.followers.title') : this.translateService.instant('pages.followings.title'),
        user: this.user,
        scopeList: tab == 1 ? this.user.followers : this.user.followings
      },
    });

  }

  validateAvatar(): string {
    return this.user.avatar != null ? this.user.avatar : this.getImage(this.user.userName);

  }

  getImage(name: string): string {
    let image = 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(name, 15, 25))
    return image;
  }

  launch(_IdProduct: string) {

    Swal.fire({
      title: 'Está seguro que desea lanzar el producto?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Lanzar',
      denyButtonText: `Descartar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          _id: _IdProduct
        }
        this.productService.launch(payload).subscribe((response) =>{
          this.showAlert('Producto Lanzado con exito!');
          this.ngOnInit();
        });

      }
    });

  }


  ngAfterViewInit(): void {
  }


}
