import { Routes } from '@angular/router';
import { publicGuard } from '@core/guards/public.guard';
import { privateGuard } from '@core/guards/private.guard';
import { LoginComponent } from '@core/auth/pages/login/login.component';
import { HomeComponent } from '@features/home/pages/index/home.component';
import { ProductGridComponent } from '@features/products/pages/grid/product-grid.component';
import { ToogleProductComponent } from '@features/products/pages/toggle/toogle-product.component';
import { ClientGridComponent } from '@features/clients/pages/grid/client-grid.component';
import { ToogleClientComponent } from '@features/clients/pages/toogle/toogle-client.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'console',
    canActivate: [privateGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'products',
        children: [
          { path: '', component: ProductGridComponent },
          { path: 'create', component: ToogleProductComponent },
          { path: 'edit/:id', component: ToogleProductComponent },
        ],
      },
      {
        path: 'clients',
        children: [
          { path: '', component: ClientGridComponent },
          { path: 'create', component: ToogleClientComponent },
          { path: 'edit/:id', component: ToogleClientComponent },
        ],
      },
    ],
  },
];
