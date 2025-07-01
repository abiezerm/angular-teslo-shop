import { Component, inject, resource } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ProductsService } from '@core/products/services/products.service';
import { PaginationComponent } from "@shared/components/pagination.component";
import { ProductCardComponent } from "@products/components/product-card.component";
import { PaginationService } from '@core/shared/services/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  template: `
    <h1 class="text-3xl font-bold">All products <span class="text-accent">{{ gender() }}</span></h1>
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
export class GenderPageComponent {
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  gender = toSignal(
    this.route.params.pipe(
      map( ({ gender }) => gender)
    )
  )

  productsResource = rxResource({
    params: () => ({
      gender : this.gender(),
      page: this.paginationService.currentPage() - 1
    }),
    stream: ({ params }) => {
      return this.productsService.get({
        gender: params.gender,
        offset: params.page * 9
      });
    }
  });
}
