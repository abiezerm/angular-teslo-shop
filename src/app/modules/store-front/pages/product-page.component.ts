import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/core/products/services/products.service';
import { ProductCarouselComponent } from "../../products/components/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  template: `
    @if(productResource.isLoading()) {
      <div class="flex justify-center items-center h-screen">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    }

    @if(productResource.hasValue()) {
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Images -->
        <app-product-carousel [images]="productResource.value().images" />

        <div>
          <h2 class="text-2xl font-bold">{{ productResource.value().title }}</h2>
          <div class="divider"></div>

          <p>{{ productResource.value().description }}</p>
        </div>
      </div>
    }
  `,
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);


  productSlug = this.activatedRoute.snapshot.paramMap.get('idSlug') || '';

  productResource = rxResource({
    params: () => ({ slug: this.productSlug }),
    stream: ({ params }: { params: { slug: string } }) => this.productService.getBySlug(params.slug),
  });
}
