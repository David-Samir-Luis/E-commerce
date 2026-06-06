import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { BrandService } from '../brands/brand.service';
import { IkeyValue } from './ikey-value.interface';
import { Subscription } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { isPlatformBrowser } from '@angular/common';
import { ItemProductComponent } from "../../shared/ui/item-product/item-product.component";
import { LoadingPageComponent } from "../../shared/ui/loading-page/loading-page.component";
import { EmptyProductsComponent } from "../shop/empty-products/empty-products.component";
import { FormsModule } from '@angular/forms';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { HttpParams } from '@angular/common/http';
import { SearchProductPipe } from '../../shared/pipes/search-product-pipe';


@Component({
  selector: 'app-search',
  imports: [NgxPaginationModule, ItemProductComponent, LoadingPageComponent, EmptyProductsComponent, FormsModule,SearchProductPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly productsService = inject(ProductsService)
  private readonly categoriesService = inject(CategoriesService)
  private readonly brandService = inject(BrandService)
  private readonly pLATFORM_ID = inject(PLATFORM_ID)
  private readonly router = inject(Router)
  constructor(private flowbiteService: FlowbiteService) { }

  sub = new Subscription();
  productsList = signal<Iproduct[]>([])
  categoriesList = signal<Icategory[]>([])
  brandsList = signal<Ibrand[]>([])
  isGrid = signal<boolean>(true)
  searchedinfo = signal<IkeyValue[]>([])
  pageSize = signal<number>(0);
  cp = signal<number>(0);
  total = signal<number>(0);
  min = signal<number>(0);
  max = signal<number>(0);
  sortBy = signal<string>('');
  searchValue = signal<string>('');
  limit = computed<number>(() => this.searchValue() === '' ? 12 : 50);
  displaymin = signal<number>(0);
  displaymax = signal<number>(0);
  loadingProducts = signal<boolean>(false);
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    this.getAllCategoriesData();
    this.getAllBrandsData()
    this.activatedRoute.queryParamMap.subscribe(
      (queryParams) => {

        const minNum = queryParams.get('price[gte]')
        const maxNum = queryParams.get('price[lte]')
        const sort = queryParams.get('sort')
        const qq = queryParams.get('q')

        this.min.set(minNum === null ? 0 : +minNum)
        this.max.set(maxNum === null ? 0 : +maxNum)
        this.displaymin.set(this.min())
        this.displaymax.set(this.max())

        this.sortBy.set(sort ?? '')
        this.searchValue.set(qq ?? '')

        const { q, ...rest } = this.activatedRoute.snapshot.queryParams;
        const url = new HttpParams({ fromObject: rest }).toString();
        this.getSearchResults(url ?? '')
        // this.getSearchResults(this.router.url.split('?')[1] ?? '')
      }
    )
  }



  getSearchResults(queryParams: string) {
    this.loadingProducts.set(true)
    this.sub.unsubscribe()
    this.sub = this.productsService.searchProducts(queryParams,this.limit()).subscribe({
      next: res => {
        this.productsList.set(res.data)
        this.pageSize.set(res.metadata.limit)
        this.cp.set(res.metadata.currentPage)
        if (this.searchValue()==='') {
          this.total.set(res.results)
        }else{
          this.total.set(50)
        }
        
        this.loadingProducts.set(false)

      },
      error: () => {
        this.loadingProducts.set(false)
      }
    })
  }



  getAllCategoriesData() {
    this.categoriesService.getAllCategories().subscribe({
      next: res => {
        this.categoriesList.set(res.data)

        const arr = this.activatedRoute.snapshot.queryParamMap.getAll('category');
        this.categoriesList().forEach((cat) => {
          if (arr.includes(cat._id)) {
            this.searchedinfo.update(value => [...value, { key: 'category', value: cat._id, name: cat.name }])
          }
        })

      },
      error: err => {
      }
    })
  }



  getAllBrandsData() {
    this.brandService.getAllBrands().subscribe({
      next: res => {
        this.brandsList.set(res.data)

        const arr = this.activatedRoute.snapshot.queryParamMap.getAll('brand');
        this.brandsList().forEach((brand) => {
          if (arr.includes(brand._id)) {
            this.searchedinfo.update(value => [...value, { key: 'brand', value: brand._id, name: brand.name }])
          }
        })
      }
    })
  }


  checkboxSearch(type: 'category' | 'brand', id: string, isChecked: boolean, name: string = '') {
    const arr = this.activatedRoute.snapshot.queryParamMap.getAll(type);

    if (isChecked) {
      this.searchedinfo.update(value => [...value, { key: type, value: id, name: name }])
      this.router.navigate([], {
        queryParams: { [type]: arr.length ? [...arr, id] : id, page: null },
        queryParamsHandling: 'merge'
      })
    } else {
      this.searchedinfo.update(value => value.filter(item => item.value !== id))
      const filteredArr = arr.filter((item) => item !== id)
      this.router.navigate([], {
        queryParams: { [type]: filteredArr.length ? filteredArr : null, page: null },
        queryParamsHandling: 'merge'
      })
    }

  }


  clearAll() {
    this.searchedinfo.set([]);
    this.router.navigate([], {
      queryParams: {},
    });
  }


  changePage(pageNumber: number) {
    this.scrollToTop()
    this.router.navigate([], {
      queryParams: { page: pageNumber }
      , queryParamsHandling: 'merge'
    })


  }



  scrollToTop() {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  //'sort'|'price[lte]'|'price[gte]'

  minMaxSort(type: 'sort' | 'minPrice' | 'maxPrice' | 'q', value: string | number) {

    let key: string = type;

    if (type === 'minPrice') { key = 'price[gte]' }
    else if (type === 'maxPrice') { key = 'price[lte]' }

    this.router.navigate([], {
      queryParams: { [key]: value === 0 || value === '' ? null : value, page: null },
      queryParamsHandling: 'merge'
    })

  }


  clearMinMax() {
    this.router.navigate([], {
      queryParams: { 'price[lte]': null, 'price[gte]': null, page: null },
      queryParamsHandling: 'merge'
    })
  }



}
