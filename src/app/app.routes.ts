import { Routes } from '@angular/router';
import { publicGuard } from '@core/guards/public.guard';
import { privateGuard } from '@core/guards/private.guard';
import { LoginComponent } from '@core/auth/pages/login/login.component';
import { HomeComponent } from '@features/home/pages/index/home.component';
import { ProductGridComponent } from '@features/products/pages/grid/product-grid.component';
import { ToogleProductComponent } from '@features/products/pages/toggle/toogle-product.component';
import { ClientGridComponent } from '@features/clients/pages/grid/client-grid.component';
import { ToogleClientComponent } from '@features/clients/pages/toogle/toogle-client.component';
import { OrderGridComponent } from '@features/orders/pages/grid/order-grid.component';
import { CreateOrderComponent } from '@features/orders/pages/create/create-order.component';
import { CollectionGridComponent } from '@features/collections/pages/grid/collection-grid.component';
import { CollectionTrackingComponent } from '@features/collections/pages/tracking/collection-tracking.component';

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
      {
        path: 'orders',
        children: [
          { path: '', component: OrderGridComponent },
          { path: 'create/:id', component: CreateOrderComponent },
        ],
      },
      {
        path: 'collections',
        children: [
          { path: '', component: CollectionGridComponent },
          { path: 'tracking/:clientId', component: CollectionTrackingComponent },
        ],
      },
    ],
  },
];
