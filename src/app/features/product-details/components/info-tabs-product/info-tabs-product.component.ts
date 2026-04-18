import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { ProductDetailsTabComponent } from "./components/product-details-tab/product-details-tab.component";
import { ReviewsTabComponent } from "./components/reviews-tab/reviews-tab.component";
import { ShippingTabComponent } from "./components/shipping-tab/shipping-tab.component";
import { ReviewsService } from './components/reviews-tab/reviews.service';
import { ProductDataService } from '../../../../core/services/product-data.service';

@Component({
  selector: 'app-info-tabs-product',
  imports: [ProductDetailsTabComponent, ReviewsTabComponent, ShippingTabComponent],
  templateUrl: './info-tabs-product.component.html',
  styleUrl: './info-tabs-product.component.css',
})
export class InfoTabsProductComponent implements OnInit {
  tab = signal<number>(1);
  productId = input.required<string>();
  reviewsList = signal<Ireview[]>([])
  private readonly reviewsService = inject(ReviewsService)
  private readonly productDataService = inject(ProductDataService)
  constructor() {
    effect(() => {
      if (this.productDataService.trigger() > 0) {
        this.getReviewsForProduct()
      }
    });
  }

  ngOnInit(): void {
    this.getReviewsForProduct()
  }

  getReviewsForProduct() {
    this.reviewsService.getReviewsForProduct(this.productId()).subscribe(
      (res) => {
        this.reviewsList.set(res.data);
        this.productDataService.ratingsQuantity.set(this.reviewsList().length)
        const ratingavg=this.reviewsList().reduce((sum, review) => sum + review.rating, 0) / this.reviewsList().length
        this.productDataService.ratingsAverage.set(Number(ratingavg.toFixed(1)))
      }
    )
  }

}
