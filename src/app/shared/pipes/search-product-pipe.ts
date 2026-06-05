import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchProduct',
})
export class SearchProductPipe implements PipeTransform {
  transform(productsList: Iproduct[], value: string): Iproduct[] {
    return productsList.filter((product)=>
      product.title.toLowerCase().includes(value.toLowerCase())||
      product.category.name.toLowerCase().includes(value.toLowerCase())||
      product.brand.name.toLowerCase().includes(value.toLowerCase())
    );
    
  }
}
