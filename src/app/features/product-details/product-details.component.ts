import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { NavProductComponent } from "./components/nav-product/nav-product.component";
import { InfoProductComponent } from "./components/info-product/info-product.component";
import { LoadingProductDetailsComponent } from "./components/loading-product-details/loading-product-details.component";
import { InfoTabsProductComponent } from "./components/info-tabs-product/info-tabs-product.component";
import { SimilarProductsComponent } from "./components/similar-products/similar-products.component";
import { ProductDataService } from '../../core/services/product-data.service';

@Component({
  selector: 'app-product-details',
  imports: [NavProductComponent, InfoProductComponent, LoadingProductDetailsComponent, InfoTabsProductComponent, SimilarProductsComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly productsService = inject(ProductsService)
  private readonly productDataService = inject(ProductDataService)
  product = signal<IdetailedProduct>({} as IdetailedProduct)
  loading = signal<boolean>(true)
  productId = signal<string>('')



  ngOnInit(): void {
    this.loading.set(true);
    this.activatedRoute.paramMap.subscribe(
      (params) => {
        this.productId.set(params.get('id')!)
        this.getSpecificProductData(this.productId())
      }
    )
  }

  getSpecificProductData(productId: string): void {
    this.productsService.getSpecificProduct(productId).subscribe({
      next: res => {
        this.product.set(res.data);
        this.productDataService.ratingsAverage.set(this.product().ratingsAverage)
        this.productDataService.ratingsQuantity.set(this.product().ratingsQuantity)
        this.productDataService.productId.set(this.product().id)
        this.loading.set(false);

      }
    })

  }


}
