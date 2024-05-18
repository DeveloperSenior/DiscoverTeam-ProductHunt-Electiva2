import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductModel } from '../product/model/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../../services/product.service';
import { ComponentBase } from '../../base/components/component.base';
import { minidenticon } from 'minidenticons'
import { StarRatingColor } from '../../base/utilities/utilities';
import { FiltersModalComponent } from './modals/filters.modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { DetailProductModalComponent } from '../product/modals/detail-product.modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent extends ComponentBase implements OnInit, AfterViewInit {

  rating: number = 3;
  starCount: number = 5;
  starColor: StarRatingColor = StarRatingColor.accent;
  starColorP: StarRatingColor = StarRatingColor.primary;
  starColorW: StarRatingColor = StarRatingColor.warn;
  productsListMaster!: ProductModel[] | [];
  scopeList!: any[] | [];
  scopeListBest!: any[] | [];
  scopeListFilter!: any[] | [];
  dataSource = new MatTableDataSource(this.scopeList);
  dataSourceBest = new MatTableDataSource(this.scopeListBest);
  dataSourceFilter = new MatTableDataSource(this.scopeListFilter);
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('tableSort') tableSort!: MatSort;
  @ViewChild('paginatorBest') paginatorBest!: MatPaginator;
  @ViewChild('tableSortBest') tableSortBest!: MatSort;
  @ViewChild('paginatorFilter') paginatorFilter!: MatPaginator;
  @ViewChild('tableSortFilter') tableSortFilter!: MatSort;
  displayedColumns: string[] = ['name'];
  displayedColumnsBest: string[] = ['name'];
  displayedColumnsFilter: string[] = ['name'];

  filtersModalRef: MdbModalRef<FiltersModalComponent> | null = null;
  detailProductModalRef: MdbModalRef<DetailProductModalComponent> | null = null;


  dataFilter!: any;
  user!: any;

  constructor(public override translateService: TranslateService,
     private productService: ProductService,
     private modalService: MdbModalService) {
    super(translateService);
  }

  ngOnInit(): void {
    this.user ={
      email: localStorage.getItem('xa-user')
    }
  }

  private mapFilter(): ProductModel {
    return this.dataFilter;
  }

  openFilterModal(filterText: string){
    this.filtersModalRef = this.modalService.open(FiltersModalComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
      data: { filterText: filterText,
        filtered: this.dataFilter
      },
    });

    this.filtersModalRef.onClose.subscribe((data: any) =>{
        if(data){
          this.dataFilter = data;
          this.onFindFilter(data);
        }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFindFilter(filter: any = this.mapFilter()): void {
    this.scopeListFilter = [];
    this.dataSourceFilter = new MatTableDataSource<any>(this.scopeListFilter);
    this.dataSourceFilter._updateChangeSubscription();
    this.dataSourceFilter.paginator = this.paginatorFilter;
    this.dataSourceFilter.sort = this.tableSortFilter;
    const limit = this.dataSourceFilter.paginator.pageSize + "";
    this.productService.queryFindAllProducts(filter, '1', limit || undefined).subscribe((response: any) => {
      this.onResponseFindFilter(response.body, response.body.message);
    });
  }

  onResponseFindFilter(body: any, error?: string | undefined): void {
    if (!error) {
      if (body.data && body.data.length > 0) {

        this.scopeListFilter = body.data || [];
        this.scopeListFilter.length = body.totalPage;
        this.dataSourceFilter = new MatTableDataSource(this.scopeListFilter);
        this.dataSourceFilter.paginator = this.paginatorFilter;
        this.dataSourceFilter.sort = this.tableSortFilter;

      }
    } else {
      this.showAlert(error);
    }
  }

  getNextDataFilter(currentSize: number, offset: string, limit: string) {

    this.productService
      .queryFindAllProducts(this.mapFilter(), offset, limit)
      .subscribe((response: any) => {
        let data = response.body.data;
        let error = response.body.message;
        if (!error) {

          this.scopeListFilter.length = currentSize;
          this.scopeListFilter.push(...data as []);


          this.scopeListFilter.length = response.body.totalPage;

          this.dataSourceFilter = new MatTableDataSource<any>(this.scopeListFilter);
          this.dataSourceFilter._updateChangeSubscription();
          this.dataSourceFilter.paginator = this.paginatorFilter;
          this.dataSourceFilter.sort = this.tableSortFilter;

        } else {
          this.showAlert(error);
        }

      });
  }

  pageChangedFilter(event: any) {

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    let previousIndex = event.previousPageIndex;

    let previousSize = pageSize * pageIndex;

    this.getNextDataFilter(previousSize, (pageIndex).toString(), pageSize.toString());
  }

  onFind(filter: any = this.mapFilter()): void {
    this.scopeList = [];
    this.dataSource = new MatTableDataSource<any>(this.scopeList);
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.tableSort;
    const limit = this.dataSource.paginator.pageSize + "";
    this.productService.queryFindLaunchedProducts(filter, '1', limit || undefined).subscribe((response: any) => {
      this.onResponseFind(response.body, response.body.message);
    });
  }

  onResponseFind(body: any, error?: string | undefined): void {
    if (!error) {
      if (body.data && body.data.length > 0) {

        this.scopeList = body.data || [];
        this.scopeList.length = body.totalPage;
        this.dataSource = new MatTableDataSource(this.scopeList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.tableSort;

      }
    } else {
      this.showAlert(error);
    }
  }

  getNextData(currentSize: number, offset: string, limit: string) {

    this.productService
      .queryFindLaunchedProducts(this.mapFilter(), offset, limit)
      .subscribe((response: any) => {
        let data = response.body.data;
        let error = response.body.message;
        if (!error) {

          this.scopeList.length = currentSize;
          this.scopeList.push(...data as []);


          this.scopeList.length = response.body.totalPage;

          this.dataSource = new MatTableDataSource<any>(this.scopeList);
          this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.tableSort;

        } else {
          this.showAlert(error);
        }

      });
  }

  pageChanged(event: any) {

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    let previousIndex = event.previousPageIndex;

    let previousSize = pageSize * pageIndex;

    this.getNextData(previousSize, (pageIndex).toString(), pageSize.toString());
  }

  onFindBest(filter: any = this.mapFilter()): void {
    this.scopeListBest = [];
    this.dataSourceBest = new MatTableDataSource<any>(this.scopeListBest);
    this.dataSourceBest._updateChangeSubscription();
    this.dataSourceBest.paginator = this.paginatorBest;
    this.dataSourceBest.sort = this.tableSortBest;
    const limit = this.dataSourceBest.paginator.pageSize + "";
    filter = {
      rate: 5 // only rate 5 stars filters
    }
    this.productService.queryFindAllProducts(filter, '1', limit || undefined).subscribe((response: any) => {
      this.onResponseFindBest(response.body, response.body.message);
    });
  }

  onResponseFindBest(body: any, error?: string | undefined): void {
    if (!error) {
      if (body.data && body.data.length > 0) {
        this.scopeListBest = body.data || [];
        this.scopeListBest.length = body.totalPage;
        this.dataSourceBest = new MatTableDataSource(this.scopeListBest);
        this.dataSourceBest.paginator = this.paginatorBest;
        this.dataSourceBest.sort = this.tableSortBest;
      }
    } else {
      this.showAlert(error);
    }
  }

  getNextDataBest(currentSize: number, offset: string, limit: string) {
    const filter = {
      rate: 5 // only rate 5 stars filters
    }
    this.productService
      .queryFindAllProducts(filter, offset, limit)
      .subscribe((response: any) => {
        let data = response.body.data;
        let error = response.body.message;
        if (!error) {

          this.scopeList.length = currentSize;
          this.scopeList.push(...data as []);


          this.scopeList.length = response.body.totalPage;

          this.dataSource = new MatTableDataSource<any>(this.scopeList);
          this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.tableSort;

        } else {
          this.showAlert(error);
        }

      });
  }

  pageChangedBest(event: any) {

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    let previousIndex = event.previousPageIndex;

    let previousSize = pageSize * pageIndex;

    this.getNextDataBest(previousSize, (pageIndex).toString(), pageSize.toString());
  }

  getImage(name: string): string {
    let image = 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(name, 15, 25))
    return image;
  }

  ngAfterViewInit(): void {
    this.onFind();
    this.onFindBest();
  }

  onRatingChanged(rating: number): void {
    console.log(rating);
    this.rating = rating;
  }

  showProduct(data:any){
    console.log(data);
    if(this.user && this.user.email){
      this.detailProductModalRef = this.modalService.open(DetailProductModalComponent, {
        modalClass: 'modal-dialog-centered modal-lg',
        data: { product: data },
      });
    }else{
      this.showAlert('Para poder ver el detalle del producto, inicia sesión!');
    }
  }



}
