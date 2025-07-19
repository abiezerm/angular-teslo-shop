import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProductCarouselComponent } from '@products/components/product-carousel.component';
import { Product } from '@core/products/types/product.type';
import { FormUtils } from '@utils/form-utils';
import { FormErrorSpanComponent } from "@shared/components/form-error-span.component";
import { ProductsService } from '@core/products/services';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorSpanComponent],
  template: `
    <h1 class="text-2xl font-bold">{{ product().title }}</h1>
    <div class="divider"></div>

    <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- General Data -->
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl font-bold h-12">General data</h2>
        <input
          type="text"
          placeholder="Title"
          class="input input-bordered w-full"
          formControlName="title"
          [class.border-red-500]="productForm.get('title')?.errors ?? false"
        />
        <app-form-error-span [control]="productForm.get('title')!" ></app-form-error-span>

        <input
          type="text"
          placeholder="Slug"
          class="input input-bordered w-full"
          formControlName="slug"
          [class.border-red-500]="productForm.get('slug')?.errors ?? false"
        />
        <app-form-error-span [control]="productForm.get('slug')!" ></app-form-error-span>

        <textarea
          class="textarea textarea-bordered w-full"
          placeholder="Description"
          rows="6"
          formControlName="description"
          [class.border-red-500]="productForm.get('description')?.errors ?? false"
        ></textarea>
        <app-form-error-span [control]="productForm.get('description')!" />


        <h2 class="text-lg font-bold">Sales data</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              placeholder="Precio"
              formControlName="price"
              class="input input-bordered w-full"
              [class.border-red-500]="productForm.get('price')?.errors ?? false"
            />
            <app-form-error-span [control]="productForm.get('price')!" />
          </div>

          <div>
            <input
              type="number"
              placeholder="Inventario"
              formControlName="stock"
              class="input input-bordered w-full"
              [class.border-red-500]="productForm.get('stock')?.errors ?? false"
            />
            <app-form-error-span [control]="productForm.get('stock')!" />
          </div>

        </div>

        <!-- tags -->
        <input type="text" placeholder="Tags" class="input input-bordered w-full" formControlName="tags" />

        <!-- buttons for gender -->
        <div class="grid grid-cols-4 gap-2">
          <button
            type="button"
            [class.btn-primary]="productForm.value.gender === 'men'"
            (click)="productForm.patchValue({ gender: 'men' })"
            class="btn btn-sm">Male</button>
          <button type="button" [class.btn-accent]="productForm.value.gender === 'women'" (click)="productForm.patchValue({ gender: 'women' })" class="btn btn-sm ">Female</button>
          <button type="button" [class.btn-warning]="productForm.value.gender === 'kid'" (click)="productForm.patchValue({ gender: 'kid' })" class="btn btn-sm">Kids</button>
          <button type="button" [class.btn-secondary]="productForm.value.gender === 'unisex'" (click)="productForm.patchValue({ gender: 'unisex' })" class="btn btn-sm ">Unisex</button>
        </div>

        <!-- <select class="select select-bordered w-full">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unisex">Unisex</option>
        </select> -->

        <!-- Sizes -->
        <div class="grid grid-cols-6 gap-2">
          @for (size of sizes; track size) {
            <button
              type="button"
              (click)="onSizeClick(size)"
              [class.btn-secondary]="productForm.value.sizes?.includes(size)"
              class="btn btn-sm">
              {{ size }}
            </button>
          }
        </div>
      </div>

      <!-- images -->
      <div class="flex flex-col gap-2">
        <div class="flex justify-end h-12">
          <button class="btn btn-secondary" type="submit">
            <!-- <span class="loading loading-spinner loading-sm"></span> -->

            Save
          </button>
        </div>

        <app-product-carousel [images]="product().images" />

        <input type="file" class="file-input file-input-bordered w-full mt-4" />
      </div>
    </form>

    @if(this.wasSaved()) {
      <div class="alert alert-success fixed bottom-4 right-4 w-80 animated-fadeIn">
        <span>Product saved successfully!</span>
      </div>
    }
  `,
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();

  productService = inject(ProductsService);
  router = inject(Router);


  fb = inject(FormBuilder);
  wasSaved = signal(false);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/^(men|women|kid|unisex)$/)]],
    tags: [''],
  })

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(){
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(', ') });
    this.productForm.markAsPristine();
  }

  onSizeClick(size: string) {
    const currentSizes = this.productForm.value.sizes || [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags
        ?.toLocaleLowerCase()
        .split(',')
        .map((tag) => tag.trim()) ?? [],
    }

    if(this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productService.create(productLike as Product)
      );

      console.log('Product created successfully:', product);
      this.router.navigate(['/admin/products', product.id]);

    } else {
      await firstValueFrom(
        this.productService.update(this.product().id, productLike)
      );
      console.log('Product updated successfully:');
    }

    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);

  }
}
