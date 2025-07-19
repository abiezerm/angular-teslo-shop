import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '@core/products/types/product.type';
import { ProductImagePipe } from "../pipes/product-image.pipe";
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  template: `
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <th>Title</th>
            <th>Price</th>
            <th>Inventory</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (product of products(); track $index) {
            <tr>
              <th>
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </th>
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div class="mask mask-squircle h-12 w-12">
                      <img
                        [src]="product.images | productImage"
                        [alt]="product.title" />
                    </div>
                  </div>
                  <div>
                    <a
                      [routerLink]="['/admin/products', product.id]"
                      class="font-bold hover:text-accent transition-colors duration-300">
                      {{ product.title }}
                    </a>
                    <div class="text-sm opacity-50">{{ product.sizes.join(', ') }}</div>
                  </div>
                </div>
              </td>
              <td>
                {{ product.price | currency }}
              </td>
              <td>
                @if(product.stock <= 10) {
                  <span class="badge badge-error">{{ product.stock }}</span>
                } @else if (product.stock <= 20) {
                  <span class="badge badge-warning">{{ product.stock }}</span>
                } @else {
                  <span class="badge badge-success">{{ product.stock }}</span>
                }
              </td>
              <th>
                <a [routerLink]="['/admin/products', product.id]" class="btn btn-ghost btn-xs">Details</a>
              </th>
            </tr>
          }
      </table>
    </div>
  `,
})
export class ProductTableComponent {
  products = input.required<Product[]>();
}
