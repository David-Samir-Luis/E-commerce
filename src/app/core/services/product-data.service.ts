import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
  ratingsQuantity = signal<number>(0)
  ratingsAverage = signal<number>(0)
  productId = signal<string>('');
  trigger = signal<number>(0);

  reCallGetReviewsForProduct() {
    this.trigger.update(v => v + 1);
  }

}
