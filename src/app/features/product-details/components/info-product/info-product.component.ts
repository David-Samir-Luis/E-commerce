import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input, signal } from '@angular/core';
import { StarsProductComponent } from "../../../../shared/ui/stars-product/stars-product.component";
import { DiscountCalcPipe } from '../../../../shared/pipes/discount-calc-pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CartInLocalStorageService } from '../../../../core/services/cart-in-local-storage.service';
import { WishListService } from '../../../../core/services/wish-list.service';
import { RouterLink } from "@angular/router";
import { MystorageService } from '../../../../core/services/mystorage.service';
import { GuestWishListService } from '../../../../core/services/guest-wish-list.service';
import { ProductDataService } from '../../../../core/services/product-data.service';

@Component({
  selector: 'app-info-product',
  imports: [StarsProductComponent, DiscountCalcPipe, FormsModule, CommonModule, RouterLink],
  templateUrl: './info-product.component.html',
  styleUrl: './info-product.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InfoProductComponent {
  private readonly authService = inject(AuthService)
  private readonly cartService = inject(CartService)
  private readonly toastrService = inject(ToastrService)
  private readonly productDataService = inject(ProductDataService)
  private readonly wishListService = inject(WishListService)
  private readonly cartInLocalStorageService = inject(CartInLocalStorageService)
  private readonly guestWishListService = inject(GuestWishListService)
  product = input.required<IdetailedProduct>()
  value = signal<number>(1);
  ratingsQuantity = computed(() => this.productDataService.ratingsQuantity())
  ratingsAverage = computed(() => this.productDataService.ratingsAverage())
  isLogged = computed(() => this.authService.isLogged());
  loadingAddToCart = signal<boolean>(false);
  favoriteloading = signal<boolean>(false);
  wishListIds = computed<string[]>(() => this.wishListService.wishListIds());


  updateNumber(num: number): void {
    if (this.value() >= this.product().quantity && num === 1) { return }
    if (this.value() === 1 && num === -1) { return }
    this.value.update(value => value + num)
  }

  updateInput(val: number) {
    const max = this.product().quantity;

    if (val > max) {
      this.value.set(max);
    } else if (val < 1) {
      this.value.set(1);
    } else {
      this.value.set(val);
    }
  }


  addToCart(product: Iproduct, count: number) {
    if (count > product.quantity) {
      this.toastrService.success('this quantity not available', '', { progressBar: true, closeButton: true });
      return
    }
    if (this.isLogged()) {

      this.loadingAddToCart.set(true);

      this.cartService.addProductToCart(product._id).subscribe({
        next: res => {
          this.cartService.numOfCartItems.set(res.numOfCartItems)
        },
        error: err => {
          this.loadingAddToCart.set(false);
        },
        complete: () => {
          if (count > 1) {
            this.UpdateItemQuantity(product._id, count)
          } else {
            this.toastrService.success(`1 unit Added successfully`, '', { progressBar: true, closeButton: true })
            this.loadingAddToCart.set(false);
          }

        }
      })
    } else {

      this.cartInLocalStorageService.addToCart(product, count, false);
      this.toastrService.success(`${count} unit Added successfully`, '', { progressBar: true, closeButton: true })
    }
  }



  UpdateItemQuantity(productId: string, count: number) {
    this.cartService.UpdateCartProductQuantity(productId, count).subscribe({
      next: res => {
        this.toastrService.success(`${count} unit Added successfully`, '', { progressBar: true, closeButton: true })
        this.loadingAddToCart.set(false);
      },
      error: err => {
      }
    })

  }


  toggleFavorite(productId: string) {
    if (this.favoriteloading()) return

    const isInList: boolean = this.wishListService.wishListIds().includes(productId)
    if (this.isLogged()) {
      this.favoriteloading.set(true)
      if (isInList) {
        this.wishListService.removeProductFromWishlist(productId).subscribe({
          next: res => {
            this.wishListService.wishListIds.set(res.data)
            this.favoriteloading.set(false)
          },
          error: err => {
            this.favoriteloading.set(false)
          }
        })
      } else {
        this.wishListService.addProductToWishlist(productId).subscribe({
          next: res => {
            this.wishListService.wishListIds.set(res.data)
            this.favoriteloading.set(false)
          },
          error: err => {
            this.favoriteloading.set(false)
          }
        })
      }
    } else {
      if (isInList) {
        this.wishListService.wishListIds.set(this.guestWishListService.removeFromWishList(this.product()))
      } else {
        this.wishListService.wishListIds.set(this.guestWishListService.addToWishList(this.product()))
      }
    }
  }


  copyProductLink(product: Iproduct) {
    const url = `${window.location.origin}/details/${product.slug}/${product.id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.toastrService.success('Link copied');
    }).catch(err => {
      this.toastrService.success('Failed to copy');
    });
  }
}
