import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@core/products/services';
import { ProductDetailsComponent } from '@dashboard/components/product-details.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  template: `

    @if (this.productResource.isLoading()) {
      <div class="flex justify-center items-center h-screen">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    }

    @if(productResource.hasValue()) {
      <app-product-details [product]="productResource.value()" />
    }
  `,
})
export class ProductAdminPageComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductsService);

  productId = toSignal(
    this.activatedRoute.params.pipe(
      map(params => params['id'])
    )
  )

  productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({params}) => {
      return this.productService.getById(params.id)
    }
  })

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  })
}
