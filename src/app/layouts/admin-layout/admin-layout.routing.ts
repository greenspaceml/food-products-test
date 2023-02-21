import { Routes } from '@angular/router';
import { ProductsComponent } from '../../products/products.component';
import { ShoppingCartComponent } from '../../shopping-cart/shopping-cart.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: ProductsComponent },
    { path: 'table-list', component: ShoppingCartComponent },
];
