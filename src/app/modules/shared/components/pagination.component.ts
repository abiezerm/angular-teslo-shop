import { RouterLink } from '@angular/router';
import { Component, computed, input, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  template: `
    <div class="join flex justify-center items-center">
      @for (page of getPagesList(); track page) {
        <button
          class="join-item btn btn-square"
          [class.btn-primary]="page === activePage()"
          [routerLink]="[]"
          [queryParams]="{ page: page }"
          (click)="activePage.set(page)"
        >{{ page }}</button>
      } @empty {
        <span class="join-item">No pages available</span>
      }

    </div>
  `,
})
export class PaginationComponent {
  pages = input(0);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });
}
