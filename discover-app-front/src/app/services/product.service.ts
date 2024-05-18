import { Injectable } from "@angular/core";
import { ServiceBase } from "../base/services/base.service";
import { HttpClient } from "@angular/common/http";
import * as _jsonProduct from '../components/product/constants/product.json';


@Injectable({ providedIn: 'root' })
export class ProductService extends ServiceBase{

  contextService: string = "";

  constructor(public override http: HttpClient) {
      super(http)
  }

  create(payload: any){
    const {Product} =  _jsonProduct  as any;
    this.contextService = `${Product.context}${Product.services.create}`;
    return this.put(this.contextService, payload);
  }

  launch(payload: any){
    const {Product} =  _jsonProduct  as any;
    this.contextService = `${Product.context}${Product.services.launch}`;
    return this.patch(this.contextService, payload);
  }

  queryFindLaunchedProducts(payload: any,offset: string ="0" ,limit: string = "6",){
    const {Product} =  _jsonProduct  as any;
    this.contextService = `${Product.context}${Product.services.getLaunchedProducts}/${limit}/${offset}`;
    return this.post(this.contextService, payload);
  }

  queryFindAllProducts(payload: any,offset: string ="0" ,limit: string = "6",){
    const {Product} =  _jsonProduct  as any;
    this.contextService = `${Product.context}${Product.services.getProducts}/${limit}/${offset}`;
    return this.post(this.contextService, payload);
  }

  queryMyProducts(email: string){
    const {Product} =  _jsonProduct  as any;
    this.contextService= `${Product.context}${Product.services.getMyProducts}`;
    if (email){
      this.contextService = `${Product.context}${Product.services.getMyProducts}/${email}`;
    }
    return this.get(this.contextService);
  }

  queryDetailProduct(idProduct: string){
    const {Product} =  _jsonProduct  as any;
    this.contextService = `${Product.context}${Product.services.getDetailProduct}/${idProduct}`;
    return this.get(this.contextService);
  }

  commentsProduct(payload: any,_idProduct: string){
    const {Product} =  _jsonProduct  as any;
    this.contextService = `${Product.context}${Product.services.rateProduct}/${_idProduct}`;
    return this.put(this.contextService, payload);
  }

}
