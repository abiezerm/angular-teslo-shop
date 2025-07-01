import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbarComponent } from "../components/front-navbar.component";

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbarComponent],
  template: `
    <!-- Navbar -->
    <app-front-navbar></app-front-navbar>

    <section class="container mx-auto">
      <router-outlet></router-outlet>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreFrontLayoutComponent {

}
