import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { ProductsService } from '@core/products/services/products.service';
import { ProductCardComponent } from '@products/components/product-card.component';
import { PaginationComponent } from "@shared/components/pagination.component";
import { PaginationService } from '@core/shared/services/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  template: `
    <h1 class="text-3xl font-bold">All products {{ paginationService.currentPage() }}</h1>
    <h2 class="text-xl mb-5">For all tastes</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      @for (Product of productsResource.value()?.products; track $index) {
        <app-product-card [product]="Product" />
      }
    </div>

    <app-pagination
      [pages]="productsResource.value()?.pages ?? 0"
      [currentPage]="paginationService.currentPage()"
    />

  `,
})
export class HomePageComponent {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({ page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productsService.get({ offset: params.page * 9 });
    }
  });

}
