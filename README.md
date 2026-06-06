<div align="center">

<img src="https://cdn-icons-png.flaticon.com/128/3144/3144456.png" alt="FreshCart Logo" width="80" />

# FreshCart

**A full-featured E-Commerce web application built with Angular 21 and SSR**

[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=flat-square&logo=reactivex&logoColor=white)](https://rxjs.dev)
[![Netlify](https://img.shields.io/badge/Netlify-SSR-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://ecommerce-freshcart-project.netlify.app)

[![Live Demo](https://img.shields.io/badge/🔗%20Live%20Demo-Visit%20App-4CAF50?style=flat-square)](https://ecommerce-freshcart-project.netlify.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/David-Samir-Luis/E-commerce)

</div>

---

## 📌 Overview

FreshCart is a production-grade e-commerce SPA with Server-Side Rendering. It consumes the [RouteMinsr E-Commerce REST API](https://ecommerce.routemisr.com) and covers the entire shopping lifecycle — authentication, product browsing, cart & wishlist management (including guests), Stripe payments, and order tracking.

> **Status:** ✅ Completed & Deployed

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Routes](#-routes)
- [Architecture Notes](#-architecture-notes)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Acknowledgements](#-acknowledgements)
- [License](#-license)

---

## ✨ Features

<details>
<summary><b>🔐 Auth & User System</b></summary>

- Register & Login with JWT authentication
- Auth guards protecting private routes (`authGuard`, `isSignedGuard`)
- Forgot password → verify reset code → reset password (3-step flow)
- Token verification on app load via `verifyToken` API
- Auto logout on expired/invalid token (handled by error interceptor)

</details>

<details>
<summary><b>👤 Profile Management</b></summary>

- Edit personal information
- Change password
- Address book — add, edit & remove saved addresses

</details>

<details>
<summary><b>🛍️ Shopping Experience</b></summary>

- Browse all products, or filter by **category**, **subcategory**, or **brand**
- **Search & Filter page:** keyword search, price range, multi-select filters, sort by price/rating/newest
- **Grid / List** view toggle
- **Product details page:** image gallery, star ratings, customer reviews tab, shipping info tab, similar products section

</details>

<details>
<summary><b>🛒 Cart & Checkout</b></summary>

- Add, update quantity & remove items
- **Guest cart** persisted in localStorage via Angular signals + `effect()`
- Full checkout form with order summary
- **Cash on delivery** and **Stripe** online payment (session-based redirect)

</details>

<details>
<summary><b>❤️ Wishlist</b></summary>

- Save & remove products from wishlist
- **Guest wishlist** persisted in localStorage, automatically synced to the server on login

</details>

<details>
<summary><b>📦 Orders</b></summary>

- Full order history with per-order breakdown

</details>

<details>
<summary><b>✨ UI & UX</b></summary>

- Skeleton loading screens across all pages
- AOS scroll-triggered animations + `ngx-scroll-animations`
- Swiper carousels on the home page
- Toastr notifications for real-time feedback
- View transitions & scroll position restoration on navigation
- Fully responsive design
- 404 Not Found page

</details>

---

## 🔧 Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Angular | 21.2 |
| Rendering | `@angular/ssr` + `@netlify/angular-runtime` | 21.2.6 / 3.0.1 |
| Language | TypeScript | 5.9 |
| Reactive programming | RxJS | 7.8 |
| Styling | Tailwind CSS + Flowbite | v4 / 4.0.1 |
| State | Angular Signals | built-in |
| HTTP | Angular HTTP Client + functional interceptors | built-in |
| Auth | `jwt-decode` | 4.0 |
| Payments | Stripe (checkout session redirect) | — |
| Carousel | Swiper | 12.1 |
| Animations | AOS + `ngx-scroll-animations` | 2.3 / 3.2 |
| Notifications | `ngx-toastr` | 20.0 |
| Pagination | `ngx-pagination` | 6.0 |
| Icons | Font Awesome | 7.2 |
| Server | Express.js | 5.1 |
| Testing | Vitest | 4.0 |
| Deployment | Netlify | — |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 20`
- **npm** `>= 11`

### Installation

```bash
# Clone the repository
git clone https://github.com/David-Samir-Luis/E-commerce.git
cd e-commerce

# Install dependencies
npm install
```

### Run Development Server

```bash
npm start
# → http://localhost:4200
```

### Build for Production

```bash
npm run build
```

### Run SSR Build Locally

```bash
npm run serve:ssr:e-commerce
```

### Run Tests

```bash
npm test
```

---

## 📁 Project Structure

```
src/
├── environments/
│   └── environment.ts                         # API base URL + Stripe redirect URL
│
└── app/
    ├── app.config.ts                          # Global providers, interceptors, router config
    ├── app.routes.ts                          # All lazy-loaded route definitions
    ├── error-interceptor.ts                   # Global HTTP error handler (401, expired token)
    │
    ├── core/
    │   ├── auth/
    │   │   ├── guards/
    │   │   │   ├── auth-guard.ts              # Blocks unauthenticated access; SSR-safe
    │   │   │   └── is-signed-guard.ts         # Redirects logged-in users from login/register
    │   │   └── services/
    │   │       └── auth.service.ts            # signIn, signUp, logOut, token management
    │   ├── models/                            # Shared TypeScript interfaces (IProduct, IUser…)
    │   └── services/
    │       ├── header-interceptor.ts          # Attaches JWT `token` header to every request
    │       ├── mystorage.service.ts           # SSR-safe localStorage/sessionStorage wrapper
    │       ├── cart.service.ts                # Authenticated cart API calls (signal: numOfCartItems)
    │       ├── cart-in-local-storage.service.ts  # Guest cart via signal + effect() + localStorage
    │       ├── wish-list.service.ts           # Authenticated wishlist API calls
    │       ├── guest-wish-list.service.ts     # Guest wishlist via signal + effect() + localStorage
    │       ├── products.service.ts            # Product listing & detail API calls
    │       ├── categories.service.ts          # Categories & subcategories API calls
    │       └── product-data.service.ts        # Shared product state between components
    │
    ├── features/                              # Each folder = one lazy-loaded route
    │   ├── home/
    │   ├── shop/
    │   ├── search/
    │   ├── product-details/
    │   ├── categories/
    │   ├── brands/
    │   ├── cart/
    │   ├── wishlist/
    │   ├── checkout/
    │   ├── orders/
    │   ├── profile/
    │   │   └── components/
    │   │       ├── addresses/
    │   │       ├── profile-information/
    │   │       └── change-password/
    │   ├── login/
    │   ├── register/
    │   ├── forgot-password/
    │   └── notfound/
    │
    └── shared/
        ├── pipes/
        │   ├── discount-calc-pipe.ts          # Computes final price after discount %
        │   ├── search-product-pipe.ts         # Client-side keyword filtering
        │   ├── total-cart-items-pipe.ts       # Total quantity across all cart items
        │   └── custom-time-ago-pipe.ts        # Relative timestamps ("2 hours ago")
        └── ui/
            ├── item-product/                  # Reusable product card component
            ├── loading-page/                  # Skeleton loader
            ├── order-summary/                 # Shared order summary block
            └── stars-product/                 # Star rating display
```

---

## 🛣️ Routes

| Path | Page | Guard |
|---|---|---|
| `/` | Home | — |
| `/shop` | All Products | — |
| `/search` | Search & Filter | — |
| `/categories` | Categories | — |
| `/categories/:slug/:id` | Category Products | — |
| `/brands` | Brands | — |
| `/details/:slug/:id` | Product Details | — |
| `/cart` | Cart | — |
| `/wishlist` | Wishlist | — |
| `/checkout` | Checkout | `authGuard` |
| `/allorders` | Order History | `authGuard` |
| `/profile/addresses` | Address Book | `authGuard` |
| `/profile/profile-information` | Profile Info | `authGuard` |
| `/profile/change-password` | Change Password | `authGuard` |
| `/login` | Login | `isSignedGuard` |
| `/register` | Register | `isSignedGuard` |
| `/forgot-password` | Forgot Password | — |
| `/**` | 404 Not Found | — |

All routes are lazy-loaded standalone components.

---

## 🏗️ Architecture Notes

### HTTP Interceptors

Two functional interceptors registered via `withInterceptors()` in `app.config.ts`:

**`headerInterceptor`** — Clones every outgoing request and injects the JWT token as a `token` header when the user is authenticated.

```ts
req = req.clone({ setHeaders: { token: mystorageService.getToken()! } })
```

**`errorInterceptor`** — Catches all HTTP errors. Forces `authService.logOut()` if the API returns an expired or invalid token message. Surfaces all error messages via Toastr. Only runs in the browser (`isPlatformBrowser`).

---

### Guest Cart & Wishlist (Signals + localStorage)

Both `CartInLocalStorageService` and `GuestWishListService` follow the same pattern: an Angular `signal()` holds state in memory, and an `effect()` syncs it to localStorage on every change. On page load, the constructor rehydrates state from localStorage.

```ts
cartList = signal<IcartProduct[]>([]);

constructor() {
  // Rehydrate from localStorage on init
  if (this.mystorageService.get('cartList')) {
    this.cartList.set(JSON.parse(this.mystorageService.get('cartList')!));
  }
  // Persist every change back to localStorage
  effect(() => this.mystorageService.set('cartList', JSON.stringify(this.cartList())));
}
```

On login, guest cart/wishlist data is merged into the authenticated user's server-side state.

---

### SSR Compatibility

| Concern | Solution |
|---|---|
| `localStorage` / `sessionStorage` access | Wrapped in `mystorage.service.ts` with `isPlatformBrowser()` guard |
| Auth guards on the server | Return `true` to prevent redirect loops during hydration |
| HTTP Client | `withFetch()` for SSR compatibility |
| Hydration | `provideClientHydration(withEventReplay())` |
| Error interceptor | Skips on server via `isPlatformBrowser()` |

---

### Router Configuration

```ts
provideRouter(
  routes,
  withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
  withViewTransitions()
)
```

- Scroll position resets to top on every navigation
- Native [View Transitions API](https://developer.chrome.com/docs/web-platform/view-transitions/) enabled globally

---

### Custom Pipes

| Pipe | Input | Output |
|---|---|---|
| `discountCalcPipe` | `price: number`, `discount: number` | Final price after discount |
| `searchProductPipe` | `products: IProduct[]`, `keyword: string` | Filtered `IProduct[]` |
| `totalCartItemsPipe` | Cart item array | Total item count |
| `customTimeAgoPipe` | Date string | `"X minutes/hours/days ago"` |

---

## 🌍 Environment Variables

Defined in `src/environments/environment.ts`:

```ts
export const environment = {
  baseUrl: 'https://ecommerce.routemisr.com',  // REST API base URL
  URL: 'https://ecommerce-freshcart-project.netlify.app/'  // Stripe redirect URL
};
```

---

## 📦 Deployment

Deployed on **Netlify** using `@netlify/angular-runtime`, which handles the SSR adapter automatically — no extra Netlify config needed.

Build output is set to `server` mode in `angular.json`:

```json
"outputMode": "server",
"ssr": { "entry": "src/server.ts" }
```

---

## 📄 License

This project is for educational purposes. All rights reserved.
