import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ReviewItemComponent } from "./review-item/review-item.component";
import { MystorageService } from '../../../../../../../core/services/mystorage.service';
import { WriteReviewComponent } from "./write-review/write-review.component";
import { ProductDataService } from '../../../../../../../core/services/product-data.service';

@Component({
  selector: 'app-manage-reviews',
  imports: [RouterLink, ReviewItemComponent, WriteReviewComponent],
  templateUrl: './manage-reviews.component.html',
  styleUrl: './manage-reviews.component.css',
})
export class ManageReviewsComponent implements OnInit {
  private readonly mystorageService = inject(MystorageService)
  private readonly productDataService = inject(ProductDataService)
  reviewsList = input.required<Ireview[]>()
  sortedReviews = signal<Ireview[]>([])
  showMore = signal<boolean>(false)
  isLogged = signal<boolean>(false)
  hasReview = signal<boolean>(false)
  iswriteReview = signal<boolean>(false)
  ngOnInit(): void {
    const logged = this.mystorageService.getToken();
    this.isLogged.set(logged ? true : false)

    const userId = this.mystorageService.getUserId()
    if (this.reviewsList().find((rev) => rev.user._id === userId)) {
      this.hasReview.set(true)
    }
  }
}
