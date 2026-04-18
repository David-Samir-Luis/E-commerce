import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { LoadingPageComponent } from "../../shared/ui/loading-page/loading-page.component";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { WishListService } from '../../core/services/wish-list.service';

@Component({
  selector: 'app-checkout',
  imports: [LoadingPageComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService)
  private readonly pLATFORM_ID = inject(PLATFORM_ID)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder)
  cartDetails = signal<IcartProduct[]>([])
  loading = signal<boolean>(true);
  totalPrice = signal<number>(0);
  loggedUsercartId = signal<string>('');
  shippingFree = signal<number>(450)
  isCash = signal<boolean>(true);
  showErrors = signal<boolean>(false);
  isLogged = computed(() => this.authService.isLogged())
  checkoutForm = this.fb.group({
    shippingAddress: this.fb.group({
      details: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, , Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: ['', [Validators.required, Validators.minLength(2)]]
    })
  })
  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
    this.getCartData();
    }
  }

  getCartData() {
    if (this.isLogged()) {
      this.loading.set(true)
      this.cartService.getLoggedUserCart().subscribe({
        next: res => {
          this.cartDetails.set(res.data.products)
          this.totalPrice.set(res.data.totalCartPrice)
          this.loggedUsercartId.set(res.cartId)
          this.loading.set(false)
        },
        error: err => {
          this.loading.set(false)
        }
      })
    }
  }

  submitCheckout() {
    if (this.checkoutForm.invalid) {
      this.showErrors.set(true)
      return
    }


    if (this.isCash()) {
      this.cartService.createCashOrder(this.loggedUsercartId(),this.checkoutForm.value).subscribe({
        next:res=>{
          if (res.status==='success') {
            this.cartService.numOfCartItems.set(0)
            this.router.navigate(['/allorders'])
          }
        }
      })
    }else{
      this.cartService.createVisaOrder(this.loggedUsercartId(),this.checkoutForm.value).subscribe({
        next:res=>{
          if (res.status==='success') {
            window.open(res.session.url,'_self')
          }
        }
      })
    }
  }


}
