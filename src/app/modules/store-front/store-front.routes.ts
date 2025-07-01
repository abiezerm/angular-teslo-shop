import { Routes } from "@angular/router";
import { StoreFrontLayoutComponent } from "./layouts/store-front-layout.component";
import { HomePageComponent } from "./pages/home-page.component";
import { GenderPageComponent } from "./pages/gender-page.component";
import { ProductPageComponent } from "./pages/product-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page.component";

export const storeFrontRoutes : Routes = [
  {
    path: '',
    component: StoreFrontLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'gender/:gender', component: GenderPageComponent },
      { path: 'product/:idSlug', component: ProductPageComponent },
      { path:'**', component: NotFoundPageComponent }
    ]
  },
  { path: '**', redirectTo: '' } // Redirect any unknown paths to the root
];

export default storeFrontRoutes;
