import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@core/products/services/products.service';
import { PaginationService } from '@core/shared/services/pagination.service';
import { ProductTableComponent } from "@products/components/product-table.component";
import { PaginationComponent } from "@shared/components/pagination.component";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent],
  template: `
    <h1 class="text-2xl font-bold">Products List</h1>
    <h3 class="text-lg">Products totals
      <span class="text-accent">{{ productsResource.value()?.count ?? 0  }}</span>
    </h3>
    <div class="divider"></div>

    <div class="flex  gap-2 items-center h-20">
      <app-pagination
        [pages]="productsResource.value()?.pages ?? 0"
        [currentPage]="paginationService.currentPage()"
      />

      <select
        class="select select-bordered w-32"
        #selectPerPage
        (change)="productsPerPage.set(+selectPerPage.value)">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>

    <!-- Products List -->
    <app-product-table [products]="productsResource.value()?.products ?? []" />

  `,
})
export class ProductsAdminPageComponent {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsPerPage = signal(10);

  productsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage(),
    }),
    stream: ({ params }) => {
      return this.productsService.get({
        offset: params.page * 9,
        limit: params.limit,
      });
    }
  });

}
