import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CustomTimeAgoPipe } from '../../../../../../../../shared/pipes/custom-time-ago-pipe';
import { MystorageService } from '../../../../../../../../core/services/mystorage.service';
import { ReviewsService } from '../../reviews.service';
import { ToastrService } from 'ngx-toastr';
import { WriteReviewComponent } from "../write-review/write-review.component";
import { ProductDataService } from '../../../../../../../../core/services/product-data.service';

@Component({
  selector: 'app-review-item',
  imports: [CustomTimeAgoPipe, WriteReviewComponent],
  templateUrl: './review-item.component.html',
  styleUrl: './review-item.component.css',
})
export class ReviewItemComponent implements OnInit {
  review = input.required<Ireview>()
  hasReview=output<boolean>()
  isUserReview = signal<boolean>(false)
  loadingdelete = signal<boolean>(false)
  edit = signal<boolean>(false)
  private readonly mystorageService = inject(MystorageService)
  private readonly reviewsService = inject(ReviewsService)
  private readonly toastrService = inject(ToastrService)
  private readonly productDataService = inject(ProductDataService)

  ngOnInit(): void {
    if (this.mystorageService.getUserId()) {
      const userId = this.mystorageService.getUserId()
      if (userId === this.review().user._id) {
        this.isUserReview.set(true)
      }
    }
  }

  deleteReview() {
    if (this.loadingdelete()) return
    this.loadingdelete.set(true)
    this.reviewsService.deleteReview(this.review()._id).subscribe({
      next: res => {
        this.toastrService.success('Review Deleted')
        this.loadingdelete.set(false)
        this.productDataService.reCallGetReviewsForProduct()
        this.hasReview.emit(false)
      },
      error: err => {
        this.loadingdelete.set(false)

      }
    })
  }

}
