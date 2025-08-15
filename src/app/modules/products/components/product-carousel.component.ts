import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'app-product-carousel',
  imports: [ProductImagePipe],
  template: `
    <!-- Slider main container -->
    <div  class="swiper" #swiperContainer>
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        @for (image of images(); track $index) {
          <div class="swiper-slide">
            <img [src]="image | productImage" alt="Product Image" class="w-full h-full object-cover" />
          </div>
        } @empty {
          <div class="swiper-slide">
            <img
              [src]="null | productImage"
              alt="No Image Available"
              class="w-full h-full object-cover" />
          </div>
        }
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>

      <!-- If we need navigation buttons -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>

      <!-- If we need scrollbar -->
      <div class="swiper-scrollbar"></div>
    </div>
  `,
  styles: `
    .swiper {
      width: 100%;
      height: 100%;
    }
  `
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {
  images = input.required<string[]>();
  swiperContainer = viewChild.required<ElementRef>('swiperContainer');



  ngAfterViewInit() {
    this.swiperInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['images'].firstChange) {
      this.swiperInit();
    }
  }

  swiperInit() {
    const element = this.swiperContainer().nativeElement;

    if (!element) return;

    const swiper = new Swiper(element, {
      direction: 'horizontal',
      modules: [Navigation, Pagination],
      loop: true,
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
