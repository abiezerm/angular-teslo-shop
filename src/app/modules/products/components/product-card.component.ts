import { SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { Product } from 'src/app/core/products/types/product.type';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  template: `
    <div class="card bg-base-100 shadow-xl animate-fadeIn">
      <figure>
        <img
          loading="eager"
          [src]="product().images | productImage"
          [alt]="product().title" />
      </figure>
      <div class="card-body">
        <h2 class="card-title text-accent text-xl hover:underline cursor-pointer"><a [routerLink]="['/product', product().slug]">
          {{ product().title }}
        </a></h2>
        <p>{{ product().description | slice: 0:70 }}</p>
        <div class="card-actions justify-end">
          <a [routerLink]="['/product', product().slug]" class="link link-accent">More</a>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  product = input.required<Product>();

}
