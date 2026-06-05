import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient= inject(HttpClient)

  getAllProducts(pageNumber:number=1,limit:number=40):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products?page=${pageNumber}&limit=${limit}`)
  }
  getBrandProducts(brandId:string,pageNumber:number=1):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products?brand=${brandId}&page=${pageNumber}`)
  }
  getCategoryProducts(categoryId:string,pageNumber:number=1):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products?category=${categoryId}&page=${pageNumber}`)
  }
  getsubCategoryProducts(subcategoryId:string,pageNumber:number=1):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products?subcategory=${subcategoryId}&page=${pageNumber}`)
  }
  
  getSpecificProduct(productId:string):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${productId}`)
  }


  searchProducts(queryParams:string,limit:number=12):Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products?${queryParams}&limit=${limit}`)
  }
}
