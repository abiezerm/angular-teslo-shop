import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page.component";
import { IsAdminGuard } from "@core/auth/guards/is-admin.guard";

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canMatch: [
      IsAdminGuard,
    ],
    children: [
      { path: 'products', component: ProductsAdminPageComponent },
      { path: 'products/:id', component: ProductAdminPageComponent },
      { path: '**', redirectTo: 'products' },

    ]
  }

]

export default adminDashboardRoutes;
