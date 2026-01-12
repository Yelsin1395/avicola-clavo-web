import { Routes } from '@angular/router';
import { publicGuard } from '@core/guards/public.guard';
import { privateGuard } from '@core/guards/private.guard';
import { LoginComponent } from '@core/auth/pages/login/login.component';
import { HomeComponent } from '@features/home/pages/index/home.component';
import { ProductGridComponent } from '@features/products/pages/grid/product-grid.component';
import { ToogleProductComponent } from '@features/products/pages/toggle/toogle-product.component';

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
          {
            path: '',
            component: ProductGridComponent,
          },
          {
            path: 'create',
            component: ToogleProductComponent,
          },
        ],
      },
    ],
  },
];
