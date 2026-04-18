import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private readonly httpClient = inject(HttpClient)
  getReviewsForProduct(productId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${productId}/reviews`)
  }
  createReview(productId: string, rating: number, review: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/products/${productId}/reviews`, {
      "review": review,
      "rating": rating
    })
  }
  updateReview(reviewId: string, rating: number, review: string): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/reviews/${reviewId}`, {
      "review": review,
      "rating": rating
    })
  }
  deleteReview(reviewId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/reviews/${reviewId}`)
  }

}
