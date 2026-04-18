import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ManageReviewsComponent } from "./manage-reviews/manage-reviews.component";
import { ProductDataService } from '../../../../../../core/services/product-data.service';

@Component({
  selector: 'app-reviews-tab',
  imports: [ManageReviewsComponent],
  templateUrl: './reviews-tab.component.html',
  styleUrl: './reviews-tab.component.css',
})
export class ReviewsTabComponent implements OnInit {
  private readonly productDataService=inject(ProductDataService)
  reviewsList = input.required<Ireview[]>()
  star1 = signal<number>(0)
  star2 = signal<number>(0)
  star3 = signal<number>(0)
  star4 = signal<number>(0)
  star5 = signal<number>(0)
  ratingsAverage = computed(()=>this.productDataService.ratingsAverage())
  ngOnInit(): void {

    const ratingQuantity = this.reviewsList().length;

    if (ratingQuantity) {
      let stars: number[] = [0, 0, 0, 0, 0, 0]
      this.reviewsList().forEach((review) => {
        stars[review.rating]++;
      })

      this.star1.set(Math.round(stars[1] * 100 / ratingQuantity))
      this.star2.set(Math.round(stars[2] * 100 / ratingQuantity))
      this.star3.set(Math.round(stars[3] * 100 / ratingQuantity))
      this.star4.set(Math.round(stars[4] * 100 / ratingQuantity))
      this.star5.set(Math.round(stars[5] * 100 / ratingQuantity))
    }


  }
}
